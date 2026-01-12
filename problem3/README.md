# WalletPage – Computational Inefficiencies & Anti-Patterns

## 1. Logical & Runtime Issues

* **Undefined variable usage**: `lhsPriority` is referenced but never defined, leading to runtime or compile-time errors.
* **Incorrect filtering logic**: Filtering keeps balances with `amount <= 0`, which is almost certainly the opposite of the intended behavior.
* **Type mismatch misuse**: `sortedBalances` is typed as `WalletBalance[]` but later treated as `FormattedWalletBalance[]`.

---

## 2. React Hooks Anti-Patterns

* **Function re-creation on every render**: `getPriority` is declared inside the component, causing a new function instance on each render.
* **Incorrect `useMemo` dependency list**:

  * `prices` is included but not used inside the memoized callback.
  * `getPriority` is used but not included in the dependency array.
* **Overuse of `useMemo`**: Memoization is applied to relatively cheap operations (filter + sort), increasing complexity without clear performance benefit.

---

## 3. Computational Inefficiencies

* **Repeated priority computation**:

  * `getPriority` is called during `filter` and repeatedly during `sort` comparisons.
  * Sorting (`O(n log n)`) amplifies the cost of repeated function calls.
* **Multiple array traversals**:

  * `sortedBalances.map(...)` is executed twice.
  * One mapped result (`formattedBalances`) is never used.
* **Unnecessary recomputation on unrelated state changes**:

  * Including `prices` in the dependency array forces recomputation when prices change, even though sorting/filtering does not depend on prices.

---

## 4. React Rendering Anti-Patterns

* **Unstable React keys**: Using array index as `key` while sorting can cause incorrect reconciliation and unnecessary re-renders.
* **Derived data recreated on every render**: `rows` are rebuilt without memoization, despite being fully derived from props and hooks.

---

## 5. TypeScript Anti-Patterns

* **Use of `any`**: `blockchain: any` disables type safety and hides invalid values.
* **Redundant empty interface**: `interface Props extends BoxProps {}` adds no semantic or functional value.
* **Inaccurate type annotations**: Explicitly annotating callback parameters with incorrect types masks real data flow errors.

---

## 6. Dead / Suspicious Code

* `children` is destructured from props but never used.
* `formattedBalances` is computed but never consumed.
* `classes.row` is referenced without being defined or imported.

---

## Summary

The code contains a combination of **logical bugs**, **React hook misuse**, **avoidable recomputation**, and **TypeScript safety violations**. These issues collectively increase CPU usage, risk runtime errors, and make the component harder to reason about and maintain.
