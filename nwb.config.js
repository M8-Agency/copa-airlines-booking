module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'CopaAirlinesBooking',
      externals: {
        react: 'React'
      }
    }
  }
}
