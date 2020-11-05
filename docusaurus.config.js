module.exports = {
  title: 'Multiple Instruction Multiple Destruction',
  tagline: 'The tagline of my site',
  url: 'https://mimd.co.uk',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'mimd-v8', // Usually your GitHub org/user name.
  projectName: 'mimd', // Usually your repo name.
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Multiple Instruction Multiple Data^H^H^H^HDestruction',
      logo: {
        alt: 'My Site Logo',
        src: 'img/eye.svg',
      },
      items: [
      ],
    },

  },
  themes: ['@docusaurus/theme-classic'],
  plugins: [
    ['@docusaurus/plugin-content-blog', {
      path: 'blog',
      routeBasePath: '/'
    }]
  ],
};
