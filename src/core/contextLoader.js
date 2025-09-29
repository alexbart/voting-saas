const TEMPLATES = require('../modules/contexts/templates');

const loadContextConfig = (contextType) => {
  const config = TEMPLATES[contextType];
  if (!config) throw new Error(`Unknown context: ${contextType}`);
  return { type: contextType, ...config };
};

module.exports = { loadContextConfig };