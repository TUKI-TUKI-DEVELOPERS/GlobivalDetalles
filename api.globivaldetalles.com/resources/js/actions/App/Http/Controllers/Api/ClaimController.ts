import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ClaimController::store
* @see app/Http/Controllers/Api/ClaimController.php:30
* @route '/api/claims'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/claims',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ClaimController::store
* @see app/Http/Controllers/Api/ClaimController.php:30
* @route '/api/claims'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClaimController::store
* @see app/Http/Controllers/Api/ClaimController.php:30
* @route '/api/claims'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::store
* @see app/Http/Controllers/Api/ClaimController.php:30
* @route '/api/claims'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::store
* @see app/Http/Controllers/Api/ClaimController.php:30
* @route '/api/claims'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/claims',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::index
* @see app/Http/Controllers/Api/ClaimController.php:14
* @route '/api/claims'
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
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
export const show = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/claims/{claim}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
show.url = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { claim: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { claim: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            claim: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        claim: typeof args.claim === 'object'
        ? args.claim.id
        : args.claim,
    }

    return show.definition.url
            .replace('{claim}', parsedArgs.claim.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
show.get = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
show.head = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
const showForm = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
showForm.get = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ClaimController::show
* @see app/Http/Controllers/Api/ClaimController.php:22
* @route '/api/claims/{claim}'
*/
showForm.head = (args: { claim: number | { id: number } } | [claim: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const ClaimController = { store, index, show }

export default ClaimController