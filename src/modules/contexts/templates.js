const TEMPLATES = {
  school: {
    name: 'School',
    roles: ['Admin', 'Teacher', 'Student', 'Candidate'],
    voteWeightFormula: '1', // static weight
    identityType: 'student_id',
    settings: {
      allowSelfNomination: true,
      voterValidation: 'student_id'
    }
  },
  board: {
    name: 'Board',
    roles: ['Admin', 'Shareholder', 'Candidate'],
    voteWeightFormula: 'shares_owned',
    identityType: 'email',
    settings: {
      allowSelfNomination: false,
      voterValidation: 'share_registry'
    }
  }
};

module.exports = TEMPLATES;