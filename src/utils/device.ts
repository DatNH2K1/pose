export const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isIPad = /ipad/.test(userAgent);

    const isAndroid = /android/.test(userAgent);

    const isIPhoneOrIPod = /iphone|ipod/.test(userAgent);

    const isMobile = /mobile/.test(userAgent);

    return isIPad || isAndroid || isIPhoneOrIPod || isMobile;
};