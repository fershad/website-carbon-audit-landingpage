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

<div id="wcb" class="carbon carbonbadge wcb-d">
  {#await data}
    <!-- data is pending -->
    <div id="wcb_p">
      <span id="wcb_g">Measuring CO<sub>2</sub>&hellip;</span>
      <a
        id="wcb_a"
        target="_blank"
        rel="noopener"
        href="https://websitecarbon.com"
      >Website Carbon</a>
    </div>
  {:then value}
    <!-- data was fulfilled -->
    <div id="wcb_p">
      <span id="wcb_g">{value.c}g of CO<sub>2</sub>/view</span>
      <a
        id="wcb_a"
        target="_blank"
        rel="noopener"
        href="https://websitecarbon.com"
      >Website Carbon</a>
    </div>
    <span id="wcb_2">Cleaner than {value.p}% of pages tested</span>
  {:catch error}
    <!-- data was rejected -->
    <div id="wcb_p">
      <span id="wcb_g">No results</span>
      <a
        id="wcb_a"
        target="_blank"
        rel="noopener"
        href="https://websitecarbon.com"
      >Website Carbon</a>
    </div>
  {/await}
</div>

<style>
  #wcb.carbonbadge {
    font-size: 1rem;
    text-align: center;
    color: var(--text-color);
    line-height: 1.15;
    margin-bottom: 2rem;
  }

  #wcb.carbonbadge sub {
    vertical-align: middle;
    position: relative;
    top: 0.3em;
    font-size: 1rem;
  }

  #wcb #wcb_g,
  #wcb #wcb_a,
  #wcb #wcb_2 {
    text-shadow: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    /* font-size: 1rem; */
    line-height: 1.15;
    font-family: var(--base-font);
    text-decoration: none;
    margin: 0.2em 0;
  }

  #wcb #wcb_g,
  #wcb #wcb_a {
    padding: 0.3em 0.5em;
    border: 0.13em solid var(--background-color);
  }

  #wcb #wcb_g {
    border-radius: 0.3em 0 0 0.3em;
    background: var(--background-color);
    border-right: 0;
    min-width: 8.2em;
  }

  #wcb #wcb_a {
    border-radius: 0 0.3em 0.3em 0;
    border-left: 0;
    background: var(--color-accent-light);
    color: var(--dark-text);
    font-weight: 700;
    border-color: var(--color-accent-light);
    box-shadow: none;
    left: -0.8em;
    position: relative;
  }

  #wcb #wcb_2 {
    color: var(--light-text);
    font-size: 0.8rem;
  }
</style>
