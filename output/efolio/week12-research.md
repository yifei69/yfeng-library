# eFolio Task 12.2 - Research Answers

## Text answer 1: Time to First Byte (TTFB)

Time to First Byte measures the interval from the start of navigation until the first byte of the response arrives. It includes connection setup and server response delays, rather than measuring the time required to display the complete page. To reduce TTFB, I would first inspect the document request in Chrome DevTools and compare cached and uncached requests from different locations. I would remove unnecessary redirects, cache suitable responses at a CDN edge, and reduce slow server processing or database queries. For this Vue application, serving the built static files through an edge hosting service can reduce the distance between users and the server. Any dynamic API should be measured separately because fast delivery of the HTML does not guarantee a fast API response. JavaScript splitting mainly improves later loading and execution, rather than directly reducing the initial document's TTFB.

Reference: Google web.dev, [Optimize Time to First Byte](https://web.dev/articles/optimize-ttfb), accessed 18 October 2026.

## Text answer 2: Hotlinking and prevention

Hotlinking happens when another website embeds a resource using its original URL, so the original host serves the resource to visitors of that other site. This can consume the host's bandwidth without visitors opening its pages. One prevention method is to inspect the HTTP Referer header at the server or CDN and reject image requests from unapproved sites. Cloudflare provides Hotlink Protection for supported image extensions on sites using its proxy. I would check compatibility with the selected hosting setup before enabling it; a pages.dev deployment alone does not establish that this zone-level setting is available. Referer checks are a deterrent rather than strong authentication because clients can omit or forge the header. Sensitive resources require authenticated access or expiring signed URLs. After configuring protection, I would test both legitimate embedding and an external test page to avoid breaking the site's own images or approved partners.

Reference: Cloudflare, [Hotlink Protection](https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/), accessed 18 October 2026.
