export function validate (rule, data, init)
{
    var init = init || false,
        res  = { valid: true, invalid: false },
        def  = () =>
        ({
            valid    : true,
            invalid  : false,
            min      : false,
            max      : false,
            minLength: false,
            maxLength: false,
            pattern  : false,
            required : false,
            type     : false,
            sameAs   : false
        })

    // Skip the validation, only generate the empty data
    if(init === true)
        for(var r in rule)
            res[r] =
            {
                ...def(),
                info: rule[r]
            }

    /**
     * Data scanner
     */

    for(var n in data)
    {
        // Define rule and the data
        var r = rule[n],
            d = data[n]

        // Initialize the result for the data
        res[n] =
        {
            ...def(),
            info: r
        }

        // Get the matched rule
        var required  = r.required !== undefined,
            nullable  = r.nullable !== undefined,
            min       = r.min       || false,
            max       = r.max       || false,
            minLength = r.minLength || false,
            maxLength = r.maxLength || false,
            pattern   = r.pattern   || false,
            type      = r.type      || false,
            custom    = r.custom    || false,
            sameAs    = r.sameAs    || false

        /**
         * Required & Nullable
         */

        // Required but spaces only
        if(required && !/\S/.test(d))
            res[n].required = true
        // Required but null and not nullable
        if(required && d === null && !nullable)
        {
            res[n].required = true
            continue
        }
        // Required but undefined
        if(required && d === undefined)
        {
            res[n].required = true
            continue
        }

        /**
         * Length
         */

        // If shorter than minlength
        if(minLength !== false && d.length < minLength)
            res[n].minLength = true
        // If longer than maxlength
        if(maxLength !== false && d.length > maxLength)
            res[n].maxLength = true

        /**
         * Range
         */

        // If less than min
        if(min !== false && d < min)
            res[n].min = true
        // If grater than max
        if(max !== false && d > max)
            res[n].max = true

        /**
         * Pattern
         */

        // If not valid with the custom pattern
        if(pattern !== false && !pattern.test(d))
            res[n].pattern = true

        /**
         * Custom Validator
         */

        //
        if(custom !== false && typeof custom === 'function')
            if(!custom(d)) res[n].custom = true
        //
        if(custom !== false && typeof custom === 'array')
        {
            var failed = false

            // Run custom validators
            custom.forEach((fn) => { if(!fn(d)) failed = true })

            if(failed) res[n].custom = true
        }

        /**
         * Same As
         */

        //
        if(sameAs !== false && data[sameAs] !== undefined && d !== data[sameAs])
            res[n].sameAs = true

        /**
         * Type
         */

        if(type !== false)
        {
            var ipv4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/g.test(d),
                ipv6 = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/g.test(d)

            switch(type)
            {
                case 'email':
                    if(!/\S+@\S+/.test(d))
                        res[n].type = true
                    break
                case 'ip'   :
                    if(!ipv4 && !ipv6)
                        res[n].type = true
                    break
                case 'ipv4' :
                    if(!ipv4)
                        res[n].type = true
                    break
                case 'ipv6' : break
                    if(!ipv6)
                        res[n].type = true
                    break
                case 'url'  :
                    regex = new RegExp(`/^((https:|http:|ftp:|rtsp:|mms:)?//)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6}|localhost)(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$/`)
                    if(!regex.test(d))
                        res[n].type = true
                    break
            }
        }
    }

    /**
     * Invalid, valid scanner
     */

    if(init !== true)
    {
        for(var n in res)
        {
            for(var o in res[n])
            {
                if(o !== 'valid' && o !== 'invalid' && res[n][o] === true)
                {
                    res.valid      = false
                    res.invalid    = true
                    res[n].valid   = false
                    res[n].invalid = true
                    break
                }
            }
        }
    }

    return res
}
