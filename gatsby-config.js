module.exports = {
  siteMetadata: {
    title: `Jocelyn & Rafli Gallery`,
    description: "Jocelyn & Rafli 3D Virtual Gallery",
    author: `Jocelyn & Rafli`,
    siteUrl: `https://jocelyn-rafli-gallery.netlify.app`,
  },
  plugins: [
    `gatsby-plugin-resolve-src`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `paintings`,
        path: `${__dirname}/static/paintings/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/favicon.jpg`,
      },
    },
  ],
};
