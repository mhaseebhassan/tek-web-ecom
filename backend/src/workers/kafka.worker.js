const { consumer } = require('../config/kafka');
const { getIo } = require('../sockets/socket');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = async (orderData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const puppeteer = require('puppeteer');
      const invoicesDir = path.join(__dirname, '../../uploads/invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filePath = path.join(invoicesDir, `invoice_${orderData.order.id}.pdf`);
      
      const customerName = orderData.order.user ? orderData.order.user.name : orderData.order.guestCustomer?.name || 'Guest';
      const customerEmail = orderData.order.user ? orderData.order.user.email : orderData.order.guestCustomer?.email || '';
      const orderDate = new Date(orderData.order.createdAt || Date.now()).toLocaleDateString();
      const invoiceId = `INV-${orderData.order.id.slice(-6).toUpperCase()}`;

      // Build items HTML
      let itemsHtml = '';
      orderData.order.items.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        const bgClass = i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white';
        itemsHtml += `
          <tr class="${bgClass} border-b border-gray-100 last:border-0 text-gray-700">
            <td class="py-4 px-4 font-medium">${item.name}</td>
            <td class="py-4 px-4 text-center">${item.quantity}</td>
            <td class="py-4 px-4 text-right">$${item.price.toFixed(2)}</td>
            <td class="py-4 px-4 text-right font-semibold">$${itemTotal.toFixed(2)}</td>
          </tr>
        `;
      });

      let shippingHtml = '';
      if (orderData.order.shippingAddress) {
        shippingHtml = `
          <div>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipped To</h3>
            <p class="text-gray-800 font-medium">${orderData.order.shippingAddress.address}</p>
            <p class="text-gray-600">${orderData.order.shippingAddress.city}, ${orderData.order.shippingAddress.postalCode}</p>
            <p class="text-gray-600">${orderData.order.shippingAddress.country}</p>
          </div>
        `;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #ffffff; }
            .gradient-text { background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; color: transparent; }
          </style>
        </head>
        <body class="p-0 m-0">
          <!-- Top Accent Line -->
          <div class="h-3 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
          
          <div class="p-12 max-w-4xl mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-start mb-16">
              <div class="flex items-center gap-4">
                <div class="bg-violet-600 rounded-xl p-3 shadow-lg shadow-violet-200">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8.5H28" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <path d="M16 8.5V26" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <path d="M8 26H24" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                </div>
                <div>
                  <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">TEKRON</h1>
                  <p class="text-sm font-medium text-violet-600 tracking-wide uppercase mt-0.5">Premium Tech</p>
                </div>
              </div>
              <div class="text-right">
                <h2 class="text-4xl font-black text-gray-100 tracking-tighter uppercase mb-2">Invoice</h2>
                <p class="text-gray-500 font-medium">Invoice Number: <span class="text-gray-900 ml-1">#${invoiceId}</span></p>
                <p class="text-gray-500 font-medium mt-1">Date: <span class="text-gray-900 ml-1">${orderDate}</span></p>
                <p class="text-gray-500 font-medium mt-1">Order ID: <span class="text-gray-900 ml-1">${orderData.order.id}</span></p>
              </div>
            </div>

            <!-- Addresses -->
            <div class="grid grid-cols-2 gap-12 mb-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                <p class="text-gray-800 font-bold text-lg">${customerName}</p>
                <p class="text-gray-500 mt-1">${customerEmail}</p>
              </div>
              ${shippingHtml}
            </div>

            <!-- Order Table -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100/80 text-gray-500 text-xs uppercase tracking-wider">
                    <th class="py-4 px-4 font-semibold">Description</th>
                    <th class="py-4 px-4 text-center font-semibold">Qty</th>
                    <th class="py-4 px-4 text-right font-semibold">Unit Price</th>
                    <th class="py-4 px-4 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="flex justify-end mb-16">
              <div class="w-72 space-y-3 text-gray-600">
                <div class="flex justify-between text-sm font-medium">
                  <span>Subtotal</span>
                  <span class="text-gray-900">$${orderData.order.subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm font-medium">
                  <span>Shipping</span>
                  <span class="text-gray-900">$${orderData.order.shippingFee.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm font-medium">
                  <span>Tax (VAT)</span>
                  <span class="text-gray-900">$${orderData.order.tax.toFixed(2)}</span>
                </div>
                <div class="pt-4 mt-4 border-t-2 border-gray-100 flex justify-between items-center">
                  <span class="text-base font-bold text-gray-900">Total Amount</span>
                  <span class="text-2xl font-black text-violet-600">$${orderData.order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="pt-8 border-t border-gray-200 text-center">
              <p class="text-lg font-bold text-gray-800 mb-1">Thank you for your business!</p>
              <p class="text-sm text-gray-500">If you have any questions, please contact <span class="font-medium text-violet-600">support@tekron.com</span></p>
            </div>
          </div>
        </body>
        </html>
      `;

      const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' }
      });

      await browser.close();
      resolve(filePath);
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
