import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/testimonials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::index
* @see app/Http/Controllers/Api/TestimonialController.php:15
* @route '/api/testimonials'
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
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
export const show = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/testimonials/{testimonial}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
show.url = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testimonial: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { testimonial: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            testimonial: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        testimonial: typeof args.testimonial === 'object'
        ? args.testimonial.id
        : args.testimonial,
    }

    return show.definition.url
            .replace('{testimonial}', parsedArgs.testimonial.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
show.get = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
show.head = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
const showForm = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
showForm.get = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::show
* @see app/Http/Controllers/Api/TestimonialController.php:23
* @route '/api/testimonials/{testimonial}'
*/
showForm.head = (args: { testimonial: number | { id: number } } | [testimonial: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TestimonialController::store
* @see app/Http/Controllers/Api/TestimonialController.php:31
* @route '/api/testimonials'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/testimonials',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TestimonialController::store
* @see app/Http/Controllers/Api/TestimonialController.php:31
* @route '/api/testimonials'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TestimonialController::store
* @see app/Http/Controllers/Api/TestimonialController.php:31
* @route '/api/testimonials'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::store
* @see app/Http/Controllers/Api/TestimonialController.php:31
* @route '/api/testimonials'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TestimonialController::store
* @see app/Http/Controllers/Api/TestimonialController.php:31
* @route '/api/testimonials'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const TestimonialController = { index, show, store }

export default TestimonialController