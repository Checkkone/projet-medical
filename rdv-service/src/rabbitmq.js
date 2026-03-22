const amqplib = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:secret123@localhost:5672';

let channel = null;

// Connexion à RabbitMQ
const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Déclarer les queues
    await channel.assertQueue('rdv.created', { durable: true });
    await channel.assertQueue('rdv.cancelled', { durable: true });

    console.log('✅ Connecté à RabbitMQ');
  } catch (error) {
    console.error('❌ Erreur connexion RabbitMQ:', error.message);
  }
};

// Publier un message dans une queue
const publishMessage = async (queue, message) => {
  try {
    if (!channel) await connectRabbitMQ();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`📨 Message publié dans ${queue}:`, message);
  } catch (error) {
    console.error('❌ Erreur publication message:', error.message);
  }
};

module.exports = { connectRabbitMQ, publishMessage };