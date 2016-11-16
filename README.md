# Jalidator

伽莉蝶忒是一個輕量、簡單且容易上手的 JavaScript 資料表單驗證工具，毋須與 DOM 做綁定，單純作為檢驗資料的工具。

## 引用檔案

伽莉蝶忒是開發給 Webpack 或是 Node.js 所使用，倘若要用在瀏覽器上的話，瀏覽器則需要支援 ES6 的 `import` 和 `export`。

```js
import { validate } from 'jalidator'
```

## 配給規則

與先前敘述的相同，這是個表單驗證工具，這意味著你需要手動配置規則，令人放心的是因為伽莉蝶忒**並不是**基於 DOM 的綁定或是 HTML5 的 Attributes。因此你可以將規則獨立成一個檔案，這將令你在未來的管理和擴展上更得心應手。

一個最基本的規則範例如下：

```js
var rules =
{
    register:
    {
        username:
        {
            minLength: 8,
            maxLength: 80,
            required : true
        },
        email:
        {
            type    : email,
            required: true
        },
        // ...
    }
}
```

### 可用規則

伽莉蝶忒支援了數個基本的驗證規則，你也可以自訂驗證函式。

```js
required,  //（布林值）必填欄位
nullable,  //（布林值）可否為 `null` 值
min,       //（數值）最小數字
max,       //（數值）最大數字
minLength, //（數值）字串最小長度
maxLength, //（數值）字串最長長度
pattern,   //（字串）RegExp 表達式
sameAs,    //（字串）與欄位重複
type       //（字串）特殊驗證種類
  - email // 電子郵件地址
  - url   // 網址類型
  - ip    // IPv4 或 IPv6 地址
  - ipv4  // IPv4 地址
  - ipv6  // IPv6 地址
```

幾個基本規則你應該知道：

1. 當 `required` 與 `nullable` 在一起時，欄位要就是非空值，不然就是 `null`。

2. `sameAs` 的用法是對照另一個欄位，假設你設定 `sameAs` 為 `password`，那麼這將會對比 `data.password`。

### 自訂驗證器

伽莉蝶忒允許你自訂單個或是多個自訂驗證器，當你只有一個驗證器的時候，你只需要傳入驗證函式給 `custom` 即可，順帶注意的是，自訂驗證器將會有一個 `val` 的參數，你可以透過這個參數在自訂驗證器中使用欲驗證的資料。

```js
username:
{
    custom: (val) => val === "Wow"
}
```

倘若你有多個驗證器，你可以傳入陣列，請注意，**這些驗證器都必須通過才算合格**。

```js
username:
{
    custom: 
    [
        (val) => val < 20, 
        (val) => val > 10
    ]
}
```

## 驗證與鷹架

驗證對伽莉蝶忒來說不是難事，一但規則設定好之後你就可以直接透過 `validate` 並傳入一個規則像這樣使用：

```js
validation = validate(rule.login, {username: 'Yami', password: 'yami888'})
```

像你看到的一樣，第一個參數是欲使用的規則，第二個則是資料物件，更有趣的在稍後的回傳內容，這個稍後會提及到。

### 鷹架

有些時候你會先在網頁佈局上透過像是 `v-show="validation.password.invalid"` 來在稍後表單錯誤時呈現錯誤訊息，但是因為表單還尚未驗證，所以也就沒有錯誤訊息可言，當然，也就沒有所謂的 `validation.password` 因為一切都還沒有被執行，預料到某些框架（如：Vue.js）有可能會為此抱怨 ` Cannot read property 'length' of ...`，你可以事先初始化一個鷹架（意即：空的驗證資料），這個空的資料跟稍後驗證所回傳的資料近乎一模一樣，不過不會顯示任何錯誤罷了。

這做法很簡單，第二個參數設為 `false`，第三個參數設為 `true` 即可。

```js
validation = validate(rule.login, false, true)
```

## 回傳

伽莉蝶忒所回傳的資訊十分完整，除了驗證結果，還有驗證規則（方便你在網頁上顯示規則，如字數應小於多少⋯⋯等），該資訊是一個物件，先舉例，稍後將會詳細說明其個別用途。

```js
validation = validate(rule.login, false, true)
console.log(validation)
```

則會回傳一個這樣的物件，要注意的是驗證結果在錯誤的時候會是 `true`，舉例來說：倘若 `username` 欄位是空的，那麼 `username.required` 則會是 `true`。如果你覺得這樣過於麻煩，你可以直接使用 `username.valid`，這會在 `username` **合格的時候返回 `true`**，反之，另一個 `username.invalid` 會在**不合格的時候返回 `true`**。

```js
{
    // 總體的驗證結果
    valid   : true,
    invalid : false,
    
    // 資料 username 的驗證結果
    username:
    {
        valid    : true,
        invalid  : false,
        info     : { ... } // username 的規則
        min      : false,
        max      : false,
        minLength: false,
        maxLength: false,
        pattern  : false,
        required : false,
        type     : false,
        sameAs   : false
    },
    
    // 資料 password 的驗證結果
    password:
    {
        // ...
```

### 規則資訊

你可以看到上述範例中有個 `username.info`，每個驗證結果都會有一個 `info` 物件，這會帶有你先前在規則中設置的資料，方便你能夠用在其他地方，舉例來說：

```pug
span(v-show="validation.identifier.invalid")
    | 帳號最短是 {{ validation.identifier.info.minLength }} 個字，
    | 最長 {{ validation.identifier.info.maxLength }} 個字。
```

你就不必手動在網頁上重新打一次規則，因為你可以直接飲用你先前配置的規則，你可能會好奇，你還沒有驗證表單，這些資料要從哪裡來？還記得我們提到的「鷹架」嗎？不妨往回看看？

## Todo

這部分是開發者的筆記，使用者可以自行略過。

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


```js
required: '!username'

required: 'password'
```
