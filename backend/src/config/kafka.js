const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'tekron-backend',
  brokers: ['127.0.0.1:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 5,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'tekron-workers' });

let isConnected = false;

const connectKafka = async () => {
  try {
    await producer.connect();
    isConnected = true;
    console.log('✅ Kafka Producer connected');
  } catch (error) {
    console.error('❌ Kafka connection error:', error.message);
    console.warn('⚠️  App will continue running without Kafka (fallback mode).');
  }
};

const disconnectKafka = async () => {
  if (isConnected) {
    await producer.disconnect();
    await consumer.disconnect();
  }
};

const produceEvent = async (topic, eventType, payload) => {
  if (!isConnected) {
    console.log(`[Kafka Fallback] Would have emitted ${eventType} to topic ${topic}`);
    return;
  }
  
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: eventType,
          value: JSON.stringify(payload),
        },
      ],
    });
  } catch (error) {
    console.error('❌ Failed to produce Kafka event:', error);
  }
};

module.exports = {
  kafka,
  producer,
  consumer,
  connectKafka,
  disconnectKafka,
  produceEvent,
};
