const { consumer } = require('../config/kafka');
const { getIo } = require('../sockets/socket');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = async (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      const invoicesDir = path.join(__dirname, '../../uploads/invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filePath = path.join(invoicesDir, `invoice_${orderData.order.id}.pdf`);
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // --- Brand Colors ---
      const primaryColor = '#8B5CF6'; // Violet-500
      const secondaryColor = '#C4B5FD'; // Violet-300
      const textColor = '#1F2937'; // Gray-800
      const lightGray = '#F9FAFB'; // Gray-50

      // Draw top accent bar
      doc.rect(0, 0, doc.page.width, 15).fill(primaryColor);

      // --- Draw Native Tekron SVG Logo ---
      doc.save();
      // Translate to logo position (x=50, y=40) and scale up a bit
      doc.translate(50, 40);
      doc.scale(2);

      // Base rounded box
      doc.roundedRect(0, 0, 36, 36, 8).fill(primaryColor);

      // SVG Paths translated for the T shape
      doc.path('M7 8.5 H 25').lineWidth(3).lineCap('round').stroke('#FFFFFF');
      doc.path('M16 8.5 V 24').lineWidth(3).lineCap('round').stroke('#FFFFFF');
      doc.path('M9 24 H 23').lineWidth(3).lineCap('round').stroke(secondaryColor);
      
      doc.restore();

      // Invoice Title & Info
      doc.fontSize(28).font('Helvetica-Bold').fillColor(primaryColor).text('INVOICE', 0, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor('#6B7280');
      doc.text(`Invoice #: INV-${orderData.order.id.slice(-6).toUpperCase()}`, { align: 'right' });
      doc.text(`Date: ${new Date(orderData.order.createdAt || Date.now()).toLocaleDateString()}`, { align: 'right' });
      doc.text(`Order ID: ${orderData.order.id}`, { align: 'right' });

      // Company Info under logo
      doc.fontSize(20).font('Helvetica-Bold').fillColor(textColor).text('TEKRON', 135, 65);
      doc.fontSize(10).font('Helvetica').fillColor('#6B7280').text('Premium Tech & Electronics', 135, 90);

      doc.moveDown(3);

      // --- Billing Info ---
      const customerName = orderData.order.user ? orderData.order.user.name : orderData.order.guestCustomer?.name || 'Guest';
      const customerEmail = orderData.order.user ? orderData.order.user.email : orderData.order.guestCustomer?.email || '';
      
      doc.fontSize(12).font('Helvetica-Bold').fillColor(textColor).text('Billed To:', 50, 150);
      doc.fontSize(10).font('Helvetica').fillColor('#4B5563')
         .text(customerName)
         .text(customerEmail);

      // Shipping Address
      if (orderData.order.shippingAddress) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor(textColor).text('Shipped To:', 300, 150);
        doc.fontSize(10).font('Helvetica').fillColor('#4B5563')
           .text(orderData.order.shippingAddress.address, 300, 165)
           .text(`${orderData.order.shippingAddress.city}, ${orderData.order.shippingAddress.postalCode}`, 300, 180)
           .text(orderData.order.shippingAddress.country, 300, 195);
      }

      // --- Table Header ---
      const tableTop = 250;
      doc.rect(50, tableTop, 500, 25).fill(primaryColor);
      
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
      doc.text('Item Description', 60, tableTop + 7);
      doc.text('Qty', 350, tableTop + 7, { width: 50, align: 'center' });
      doc.text('Price', 400, tableTop + 7, { width: 50, align: 'right' });
      doc.text('Total', 470, tableTop + 7, { width: 70, align: 'right' });

      // --- Table Rows ---
      let y = tableTop + 35;
      doc.font('Helvetica').fontSize(10).fillColor(textColor);

      orderData.order.items.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        
        // Zebra striping
        if (i % 2 === 0) {
          doc.rect(50, y - 5, 500, 25).fill(lightGray);
        }

        doc.fillColor(textColor);
        doc.text(item.name, 60, y, { width: 280, height: 15, ellipsis: true });
        doc.text(item.quantity.toString(), 350, y, { width: 50, align: 'center' });
        doc.text(`$${item.price.toFixed(2)}`, 400, y, { width: 50, align: 'right' });
        doc.text(`$${itemTotal.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

        y += 25;
      });

      // --- Totals ---
      doc.moveTo(350, y + 10).lineTo(550, y + 10).strokeColor('#E5E7EB').stroke();
      
      y += 20;
      doc.font('Helvetica').fillColor('#4B5563');
      doc.text('Subtotal:', 350, y, { width: 100, align: 'right' });
      doc.text(`$${orderData.order.subtotal.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

      y += 20;
      doc.text('Shipping:', 350, y, { width: 100, align: 'right' });
      doc.text(`$${orderData.order.shippingFee.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

      y += 20;
      doc.text('Tax (VAT):', 350, y, { width: 100, align: 'right' });
      doc.text(`$${orderData.order.tax.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

      y += 20;
      doc.moveTo(350, y).lineTo(550, y).strokeColor(primaryColor).lineWidth(2).stroke();

      y += 10;
      doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor);
      doc.text('Total:', 350, y, { width: 100, align: 'right' });
      doc.text(`$${orderData.order.total.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

      // --- Footer ---
      const footerY = doc.page.height - 100;
      doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor('#E5E7EB').lineWidth(1).stroke();
      doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF');
      doc.text('Thank you for your business!', 50, footerY + 15, { align: 'center' });
      doc.text('If you have any questions about this invoice, please contact support@tekron.com', 50, footerY + 30, { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

const emitIfReady = (room, event, payload) => {
  try {
    const io = getIo();
    if (io) {
      io.to(room).emit(event, payload);
    }
  } catch (error) {
    // Socket.IO is optional during scripts/tests.
  }
};

const startKafkaWorker = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

    console.log('✅ Kafka Consumer worker started and listening to [order-events]');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventType = message.key.toString();
        const payload = JSON.parse(message.value.toString());

        if (eventType === 'new_order') {
          console.log(`📨 [Kafka Consumer] Processing new order: #${payload.order.id}`);
          
          // 1. Generate PDF Invoice (Heavy Task)
          console.log(`   Generating PDF invoice...`);
          const invoicePath = await generateInvoicePDF(payload);
          console.log(`   Invoice generated successfully at: ${invoicePath}`);

          // 2. Emit Socket.IO Event to Admin
          emitIfReady('admin_room', 'new-order', {
            message: payload.message,
            order: payload.order,
            notification: payload.notification,
          });
          console.log(`   Socket.IO event emitted for order #${payload.order.id}`);
        } 
        
        else if (eventType === 'low_stock') {
          emitIfReady('admin_room', 'low-stock-alert', payload);
        }
        
        else if (eventType === 'order_status_updated') {
          emitIfReady(`user:${payload.userId}`, 'order-status-updated', {
            message: payload.message,
            order: payload.order,
          });
          console.log(`   Socket.IO event emitted for order status update #${payload.order.id}`);
        }
      },
    });
  } catch (error) {
    console.error('❌ Kafka Consumer failed to start:', error.message);
  }
};

module.exports = { startKafkaWorker };
