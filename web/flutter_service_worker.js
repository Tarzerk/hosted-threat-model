'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "4f81a596157fd4f236b6a4882611f2e8",
"index.html": "85fad305746851bfdc2a79e7673810bf",
"/": "85fad305746851bfdc2a79e7673810bf",
"main.dart.js": "304543e6e06b9ad363d4f28c7e8fae88",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"android/web_android.iml": "e631be658ada5ed327bf47f851a6ed5b",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "65635ea6b369075bb1600c7c1ac97b46",
".dart_tool/package_config.json": "cb4090b7b2faf52341795632db900cc9",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/web_service_worker.stamp": "a11bb05dfd17e0b0cc31ae889189ff8d",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/dart2js.d": "e757eb5379dd83cb6c2c1a40bb707bfd",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/gen_localizations.stamp": "436d2f2faeb7041740ee3f49a985d62a",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/main.dart.js.deps": "e209b1c4a57a0f9808437dca3ec10cfb",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/main.dart.js": "f2cbdfd2bf043d23799b3e2bcce93248",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/app.dill": "8aa5cafe0d8546d9dbee1c3755919aa8",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/outputs.json": "b8e566a802579f4ac7535ec01335318a",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/web_release_bundle.stamp": "9b4e516ada4e23baf2acaf8f3607f2e7",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/flutter_assets.d": "b3a0261b6be70558c4638f2db768aa99",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/main.dart": "4e8d7de9489e1a7925e6c95868908224",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/dart2js.stamp": "9e86d4048b39ec976e2dc51657ca228d",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/service_worker.d": "a2e7de8df45a624c5b375c52bd1deec1",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/web_resources.d": "fb384c8c8f4a8876a0e4957d3acf7fe9",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/app.dill.deps": "2ee5355ba87009c9cb68a812d7326473",
".dart_tool/flutter_build/6d85f018e9574a97e85c07981664960c/web_entrypoint.stamp": "38e9891d541aec33e0ed1f19df32bd7e",
".dart_tool/package_config_subset": "1c43fac08b050fbfb2fd02af6871535f",
".dart_tool/version": "a13ed25c1389038783693bec771e71f6",
"web.iml": "0e10d326c956d57be354882dfdf4d740",
"assets/AssetManifest.json": "f5dd469cd030f287de9a6a5bf5585855",
"assets/NOTICES": "a0c9468455b9136c06b1a2760954cdc3",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/lock.png": "162839c40a45c6400baf3ccdb95f4f4a",
".idea/runConfigurations/main_dart.xml": "2b82ac5d547e7256de51268edfd10dc3",
".idea/libraries/Dart_SDK.xml": "f033f216460e971b94b738e1621879cf",
".idea/libraries/KotlinJavaRuntime.xml": "4b0df607078b06360237b0a81046129d",
".idea/workspace.xml": "cc5f609be0f96835c87839f62217d14b",
".idea/modules.xml": "6e562bd2e74aaa79b0f10c5b25fab769"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
