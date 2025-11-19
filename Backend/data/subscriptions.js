// Datos simulados de suscripciones (simulando base de datos)
// En producción, estos datos estarían en una BD real
const subscriptions = [];

/**
 * Agrega una nueva suscripción
 */
const addSubscription = (email) => {
  const newSubscription = {
    id: subscriptions.length + 1,
    email: email,
    fechaSuscripcion: new Date(),
    activo: true,
  };

  subscriptions.push(newSubscription);
  return newSubscription;
};

/**
 * Verifica si un email ya está suscrito
 */
const isSubscribed = (email) => {
  return subscriptions.some(
    (sub) => sub.email.toLowerCase() === email.toLowerCase() && sub.activo
  );
};

/**
 * Obtiene todas las suscripciones activas
 */
const getAllSubscriptions = () => {
  return subscriptions.filter((sub) => sub.activo);
};

/**
 * Obtiene el total de suscriptores
 */
const getTotalSubscriptions = () => {
  return subscriptions.filter((sub) => sub.activo).length;
};

module.exports = {
  subscriptions,
  addSubscription,
  isSubscribed,
  getAllSubscriptions,
  getTotalSubscriptions,
};
