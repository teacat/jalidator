# Jalidator
Jalidator - Easy, simple validator for JavaScript without DOM-binding.

```js
username :
{
    type: 'email',
    min: 2,
    max: 30,
    minLength: 30,
    maxLength: 50,
    pattern: '/xx/',
    custom: (val) =>
    {
    },
    custom: [() => {}, () => {}],
    sameAs: 'password',
    date:
    {
        // leap year
        direction: 'future',
        month: 'month',
        day: 'day'
    },
    
}
```
