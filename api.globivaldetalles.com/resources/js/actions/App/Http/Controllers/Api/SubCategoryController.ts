import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/subcategories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::index
* @see app/Http/Controllers/Api/SubCategoryController.php:15
* @route '/api/subcategories'
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
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
export const show = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/subcategories/{subcategory}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
show.url = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subcategory: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subcategory: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subcategory: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subcategory: typeof args.subcategory === 'object'
        ? args.subcategory.id
        : args.subcategory,
    }

    return show.definition.url
            .replace('{subcategory}', parsedArgs.subcategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
show.get = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
show.head = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
const showForm = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
showForm.get = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::show
* @see app/Http/Controllers/Api/SubCategoryController.php:23
* @route '/api/subcategories/{subcategory}'
*/
showForm.head = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\SubCategoryController::store
* @see app/Http/Controllers/Api/SubCategoryController.php:31
* @route '/api/subcategories'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/subcategories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SubCategoryController::store
* @see app/Http/Controllers/Api/SubCategoryController.php:31
* @route '/api/subcategories'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SubCategoryController::store
* @see app/Http/Controllers/Api/SubCategoryController.php:31
* @route '/api/subcategories'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::store
* @see app/Http/Controllers/Api/SubCategoryController.php:31
* @route '/api/subcategories'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::store
* @see app/Http/Controllers/Api/SubCategoryController.php:31
* @route '/api/subcategories'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\SubCategoryController::update
* @see app/Http/Controllers/Api/SubCategoryController.php:40
* @route '/api/subcategories/{subcategory}'
*/
export const update = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/subcategories/{subcategory}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\SubCategoryController::update
* @see app/Http/Controllers/Api/SubCategoryController.php:40
* @route '/api/subcategories/{subcategory}'
*/
update.url = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subcategory: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subcategory: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subcategory: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subcategory: typeof args.subcategory === 'object'
        ? args.subcategory.id
        : args.subcategory,
    }

    return update.definition.url
            .replace('{subcategory}', parsedArgs.subcategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SubCategoryController::update
* @see app/Http/Controllers/Api/SubCategoryController.php:40
* @route '/api/subcategories/{subcategory}'
*/
update.put = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::update
* @see app/Http/Controllers/Api/SubCategoryController.php:40
* @route '/api/subcategories/{subcategory}'
*/
const updateForm = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::update
* @see app/Http/Controllers/Api/SubCategoryController.php:40
* @route '/api/subcategories/{subcategory}'
*/
updateForm.put = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\SubCategoryController::destroy
* @see app/Http/Controllers/Api/SubCategoryController.php:49
* @route '/api/subcategories/{subcategory}'
*/
export const destroy = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/subcategories/{subcategory}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\SubCategoryController::destroy
* @see app/Http/Controllers/Api/SubCategoryController.php:49
* @route '/api/subcategories/{subcategory}'
*/
destroy.url = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subcategory: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { subcategory: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            subcategory: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        subcategory: typeof args.subcategory === 'object'
        ? args.subcategory.id
        : args.subcategory,
    }

    return destroy.definition.url
            .replace('{subcategory}', parsedArgs.subcategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SubCategoryController::destroy
* @see app/Http/Controllers/Api/SubCategoryController.php:49
* @route '/api/subcategories/{subcategory}'
*/
destroy.delete = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::destroy
* @see app/Http/Controllers/Api/SubCategoryController.php:49
* @route '/api/subcategories/{subcategory}'
*/
const destroyForm = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SubCategoryController::destroy
* @see app/Http/Controllers/Api/SubCategoryController.php:49
* @route '/api/subcategories/{subcategory}'
*/
destroyForm.delete = (args: { subcategory: number | { id: number } } | [subcategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const SubCategoryController = { index, show, store, update, destroy }

export default SubCategoryController