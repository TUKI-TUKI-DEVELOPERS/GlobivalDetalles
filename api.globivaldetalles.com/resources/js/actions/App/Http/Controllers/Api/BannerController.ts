import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/banners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::index
* @see app/Http/Controllers/Api/BannerController.php:15
* @route '/api/banners'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
export const show = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/banners/{banner}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
show.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { banner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        banner: typeof args.banner === 'object'
        ? args.banner.id
        : args.banner,
    }

    return show.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
show.get = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
show.head = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
const showForm = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
showForm.get = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\BannerController::show
* @see app/Http/Controllers/Api/BannerController.php:23
* @route '/api/banners/{banner}'
*/
showForm.head = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Api\BannerController::store
* @see app/Http/Controllers/Api/BannerController.php:31
* @route '/api/banners'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/banners',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\BannerController::store
* @see app/Http/Controllers/Api/BannerController.php:31
* @route '/api/banners'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\BannerController::store
* @see app/Http/Controllers/Api/BannerController.php:31
* @route '/api/banners'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\BannerController::store
* @see app/Http/Controllers/Api/BannerController.php:31
* @route '/api/banners'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\BannerController::store
* @see app/Http/Controllers/Api/BannerController.php:31
* @route '/api/banners'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\BannerController::toggleActive
* @see app/Http/Controllers/Api/BannerController.php:48
* @route '/api/banners/{banner}/toggle-active'
*/
export const toggleActive = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

toggleActive.definition = {
    methods: ["put"],
    url: '/api/banners/{banner}/toggle-active',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\BannerController::toggleActive
* @see app/Http/Controllers/Api/BannerController.php:48
* @route '/api/banners/{banner}/toggle-active'
*/
toggleActive.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { banner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        banner: typeof args.banner === 'object'
        ? args.banner.id
        : args.banner,
    }

    return toggleActive.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\BannerController::toggleActive
* @see app/Http/Controllers/Api/BannerController.php:48
* @route '/api/banners/{banner}/toggle-active'
*/
toggleActive.put = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\BannerController::toggleActive
* @see app/Http/Controllers/Api/BannerController.php:48
* @route '/api/banners/{banner}/toggle-active'
*/
const toggleActiveForm = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\BannerController::toggleActive
* @see app/Http/Controllers/Api/BannerController.php:48
* @route '/api/banners/{banner}/toggle-active'
*/
toggleActiveForm.put = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleActive.form = toggleActiveForm

const BannerController = { index, show, store, toggleActive }

export default BannerController