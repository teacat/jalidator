# Jalidator
Jalidator - Easy, simple validator for JavaScript without DOM-binding.

```js
username :
{
    type: 'email',
    min: 2,
    max: 30,
    minlength: 30,
    maxlength: 50,
    pattern: '/xx/',
    custom: (val) =>
    {
    },
    custom: [() => {}, () => {}]
}
```
