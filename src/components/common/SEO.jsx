import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    ogImage, 
    ogUrl, 
    ogType = 'website',
    schemaData 
}) => {
    const siteTitle = 'Mullenghal Furniture | Premium Wholesale & Luxury Collections';
    const fullTitle = title ? `${title} | Mullenghal Furniture` : siteTitle;
    const defaultDescription = 'Premium furniture wholesale in Kerala. Discover luxury furniture showroom collections including modern sofas, dining sets, and commercial-grade office furniture.';
    const metaDescription = description || defaultDescription;
    const currentUrl = ogUrl || window.location.href;
    const defaultImage = 'https://mullenghalfurniture.com/og-image.jpg'; // Replace with actual default OG image
    const metaImage = ogImage || defaultImage;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={currentUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}

            {/* Default Organization Schema */}
            {!schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FurnitureStore",
                        "name": "Mullenghal Furniture",
                        "image": metaImage,
                        "@id": "https://mullenghalfurniture.com",
                        "url": "https://mullenghalfurniture.com",
                        "telephone": "+91-XXXXXXXXXX",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Mullenghal Showroom",
                            "addressLocality": "Calicut",
                            "addressRegion": "Kerala",
                            "postalCode": "673001",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 11.2588,
                            "longitude": 75.7804
                        },
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": [
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday"
                            ],
                            "opens": "09:00",
                            "closes": "20:00"
                        }
                    })}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
