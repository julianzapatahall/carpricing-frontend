import React, { useEffect } from "react";

const GoogleAd = () => {
    useEffect(() => {
        // Ensure the Google Ads script is added to the document head
        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.dataset.adClient = process.env.REACT_APP_ADSENSE_CLIENT;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        // Load the ads
        const loadAds = () => {
            try {
                if (window.adsbygoogle) {
                    window.adsbygoogle.push({});
                }
            } catch (e) {
                console.error("AdSense Error:", e);
            }
        };

        // Ensure ads are loaded after the script is available
        script.onload = loadAds;
    }, []);

    return (
        <div style={{ width: "100%", height: "14vh", textAlign: "center", background: "#f8f8f8" }}>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT}
                data-ad-slot={process.env.REACT_APP_ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        </div>
    );
};

export default GoogleAd;
