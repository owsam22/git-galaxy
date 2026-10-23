import { Helmet } from 'react-helmet-async';

const SITE = 'https://gitgalaxy.owsam22.com';

export default function SEO({
  title = 'Git Galaxy – Interactive 3D GitHub Profile Visualizer',
  description = 'Explore GitHub repositories as planets in an interactive 3D universe with Git Galaxy by owsam22.',
  path = '/',
  image = `${SITE}/og-image.png`,
  noindex = false,
}) {
  // Clean path: strip query parameters and hash, normalize slashes
  const cleanPath = (path || '/').split('?')[0].split('#')[0].trim();
  const normalizedPath = cleanPath === '' || cleanPath === '/' ? '/' : (cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`);
  const canonical = `${SITE}${normalizedPath}`;

  const isAbout = normalizedPath === '/about';

  const structuredData = isAbout
    ? {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: title,
        url: canonical,
        description,
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: 'Git Galaxy',
          url: `${SITE}/`,
          description: 'Interactive 3D GitHub Profile Visualizer',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web Browser',
          author: {
            '@type': 'Person',
            name: 'Samarpan Jayswal',
            url: 'https://github.com/owsam22',
            sameAs: [
              'https://portfolio.owsam22.com/',
              'https://github.com/owsam22'
            ]
          }
        }
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Git Galaxy',
        url: canonical,
        description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        author: {
          '@type': 'Person',
          name: 'Samarpan Jayswal',
          url: 'https://github.com/owsam22',
          sameAs: [
            'https://portfolio.owsam22.com/',
            'https://github.com/owsam22'
          ]
        }
      };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large'
        }
      />

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Git Galaxy" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Git Galaxy – Interactive 3D GitHub Profile Visualizer" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@owsam22" />
      <meta name="twitter:creator" content="@owsam22" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {!noindex && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
}
