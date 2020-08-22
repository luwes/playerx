export const loading = CE => {

  CE.defineProp('loading', {
    get: (el, val) => val,
    set: (el, val) => val,
    reflect: true,
  });

  return element => {
    let { load } = element;
    let observer;
    let loadCalled;

    function newLoad() {
      if (observer) {
        observer.unobserve(element);
      }

      if (element.loading === 'user') {
        loadCalled = false;
        element.unload();
        element.load = lazyLoad;
        return;
      }

      if (element.loading === 'lazy') {
        element.unload();
        observer = initIntersectionObserver();
        return;
      }

      return load();
    }

    async function lazyLoad() {
      loadCalled = true;
      try {
        await load();
        element.load = newLoad;
      } catch (error) {
        //...
      }
    }

    function initIntersectionObserver() {
      if (
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window
      ) {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !loadCalled) {
              intersectionObserver.unobserve(element);
              lazyLoad();
            }
          });
        });

        intersectionObserver.observe(element);
        return intersectionObserver;
      }
    }

    return {
      load: newLoad,
    };
  };
};
