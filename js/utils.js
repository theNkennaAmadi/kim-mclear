// Function to reset Webflow settings after page transitions

export function resetWebflow(data) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(data.next.html, "text/html");
    const webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
    const siteId = dom.querySelector("html").getAttribute("data-wf-site");

    document.querySelector("html").setAttribute("data-wf-page", webflowPageId);

    if (window.Webflow && window.Webflow.require) {
        window.Webflow.destroy();
        window.Webflow.ready();
        window.Webflow.require('commerce').init({ siteId: siteId });
        window.Webflow.require("ix2").init();
    }
}