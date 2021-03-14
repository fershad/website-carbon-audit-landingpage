<script>
  const fullURL = window.location.href;
  const strippedURL = getPathFromUrl(fullURL);
  const wcU = encodeURIComponent(strippedURL);

  function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
  }

  const newRequest = async function(render = true) {
    // Run the API request because there is no cached result available
    // Using proxy & site URL to capture more accurate number
    const r = await fetch("https://api.websitecarbon.com/b?url=" + wcU);

    if (!r.ok) {
      throw Error(r);
    }

    try {
      const d = await r.json();
      localStorage.setItem("wcb_" + wcU, JSON.stringify(d));
      return d;
    } catch (e) {
      console.log(e);
      localStorage.removeItem("wcb_" + wcU);
      throw Error(e);
    }
  };

  async function getCarbon() {
    if ("fetch" in window) {
      // Get result if it's saved
      let cachedResponse = localStorage.getItem("wcb_" + wcU);

      // If there is a cached response, use it
      if (cachedResponse) {
        const r = JSON.parse(cachedResponse);
        const t = new Date().getTime();

        // If time since response was cached is over a day, then make a new request and update the cached result in the background
        if (t - r.t > 86400000) {
          newRequest(false);
        }

        // Return the cached response
        recordCarbon(wcU, r.c);
        return r;
      }

      // If no cached response, then fetch from API
      const nr = await newRequest();
      recordCarbon(wcU, nr.c);
      return nr;
    }
  }

  // This bit saves a record of the carbon measurement. Useful for tracking the total carbon footprint of the website.
  async function recordCarbon(site, carbon) {
    const url = `https://serverless-api.fershad.workers.dev/api/carbon/record?site=${site}&c=${carbon}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      console.log("Error saving carbon data", resp);
    }
  }

  const data = getCarbon();
</script>

<div class="text-center">
  {#await data}
    <!-- data is pending -->
    <span>Measuring CO<sub>2</sub>&hellip;</span>
  {:then value}
    <!-- data was fulfilled -->
    <p>
      This pageview produced
      <span class="marker-highlight" data-highlight="accent-light">{value.c}g of
        CO<sub>2</sub></span>.
    </p>
    <small>It's cleaner than
      {value.p}% of pages tested using the
      <a target="_blank" rel="noopener" href="https://websitecarbon.com">Website
        Carbon Calculator</a></small>
  {/await}
</div>

<style>
  p {
    margin-bottom: 0.75ex;
  }
</style>
