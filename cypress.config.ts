import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    codeCoverage: { exclude: 'cypress/**/*.*' }
  },
  video: false,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)

      return config
    }
  }
})
