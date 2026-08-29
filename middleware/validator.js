const { body, validationResult } = require('express-validator');

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'adresse email est requise')
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail(),
    
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10, max: 3000 }).withMessage('Le message doit contenir entre 10 et 3000 caractères')
    .escape()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  contactValidation,
  handleValidationErrors
};
