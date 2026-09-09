
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SearchProfile
 * 
 */
export type SearchProfile = $Result.DefaultSelection<Prisma.$SearchProfilePayload>
/**
 * Model Listing
 * 
 */
export type Listing = $Result.DefaultSelection<Prisma.$ListingPayload>
/**
 * Model ScrapeRun
 * 
 */
export type ScrapeRun = $Result.DefaultSelection<Prisma.$ScrapeRunPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SearchProfiles
 * const searchProfiles = await prisma.searchProfile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SearchProfiles
   * const searchProfiles = await prisma.searchProfile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.searchProfile`: Exposes CRUD operations for the **SearchProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SearchProfiles
    * const searchProfiles = await prisma.searchProfile.findMany()
    * ```
    */
  get searchProfile(): Prisma.SearchProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.listing`: Exposes CRUD operations for the **Listing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Listings
    * const listings = await prisma.listing.findMany()
    * ```
    */
  get listing(): Prisma.ListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scrapeRun`: Exposes CRUD operations for the **ScrapeRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapeRuns
    * const scrapeRuns = await prisma.scrapeRun.findMany()
    * ```
    */
  get scrapeRun(): Prisma.ScrapeRunDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SearchProfile: 'SearchProfile',
    Listing: 'Listing',
    ScrapeRun: 'ScrapeRun'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "searchProfile" | "listing" | "scrapeRun"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SearchProfile: {
        payload: Prisma.$SearchProfilePayload<ExtArgs>
        fields: Prisma.SearchProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SearchProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SearchProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          findFirst: {
            args: Prisma.SearchProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SearchProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          findMany: {
            args: Prisma.SearchProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>[]
          }
          create: {
            args: Prisma.SearchProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          createMany: {
            args: Prisma.SearchProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SearchProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>[]
          }
          delete: {
            args: Prisma.SearchProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          update: {
            args: Prisma.SearchProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          deleteMany: {
            args: Prisma.SearchProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SearchProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SearchProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>[]
          }
          upsert: {
            args: Prisma.SearchProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchProfilePayload>
          }
          aggregate: {
            args: Prisma.SearchProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSearchProfile>
          }
          groupBy: {
            args: Prisma.SearchProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<SearchProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.SearchProfileCountArgs<ExtArgs>
            result: $Utils.Optional<SearchProfileCountAggregateOutputType> | number
          }
        }
      }
      Listing: {
        payload: Prisma.$ListingPayload<ExtArgs>
        fields: Prisma.ListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findFirst: {
            args: Prisma.ListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findMany: {
            args: Prisma.ListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          create: {
            args: Prisma.ListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          createMany: {
            args: Prisma.ListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          delete: {
            args: Prisma.ListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          update: {
            args: Prisma.ListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          deleteMany: {
            args: Prisma.ListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          upsert: {
            args: Prisma.ListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          aggregate: {
            args: Prisma.ListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListing>
          }
          groupBy: {
            args: Prisma.ListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListingCountArgs<ExtArgs>
            result: $Utils.Optional<ListingCountAggregateOutputType> | number
          }
        }
      }
      ScrapeRun: {
        payload: Prisma.$ScrapeRunPayload<ExtArgs>
        fields: Prisma.ScrapeRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScrapeRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScrapeRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          findFirst: {
            args: Prisma.ScrapeRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScrapeRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          findMany: {
            args: Prisma.ScrapeRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          create: {
            args: Prisma.ScrapeRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          createMany: {
            args: Prisma.ScrapeRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScrapeRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          delete: {
            args: Prisma.ScrapeRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          update: {
            args: Prisma.ScrapeRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          deleteMany: {
            args: Prisma.ScrapeRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScrapeRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScrapeRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          upsert: {
            args: Prisma.ScrapeRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          aggregate: {
            args: Prisma.ScrapeRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScrapeRun>
          }
          groupBy: {
            args: Prisma.ScrapeRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScrapeRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScrapeRunCountArgs<ExtArgs>
            result: $Utils.Optional<ScrapeRunCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    searchProfile?: SearchProfileOmit
    listing?: ListingOmit
    scrapeRun?: ScrapeRunOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SearchProfileCountOutputType
   */

  export type SearchProfileCountOutputType = {
    listings: number
    runs: number
  }

  export type SearchProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listings?: boolean | SearchProfileCountOutputTypeCountListingsArgs
    runs?: boolean | SearchProfileCountOutputTypeCountRunsArgs
  }

  // Custom InputTypes
  /**
   * SearchProfileCountOutputType without action
   */
  export type SearchProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfileCountOutputType
     */
    select?: SearchProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SearchProfileCountOutputType without action
   */
  export type SearchProfileCountOutputTypeCountListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
  }

  /**
   * SearchProfileCountOutputType without action
   */
  export type SearchProfileCountOutputTypeCountRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeRunWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SearchProfile
   */

  export type AggregateSearchProfile = {
    _count: SearchProfileCountAggregateOutputType | null
    _avg: SearchProfileAvgAggregateOutputType | null
    _sum: SearchProfileSumAggregateOutputType | null
    _min: SearchProfileMinAggregateOutputType | null
    _max: SearchProfileMaxAggregateOutputType | null
  }

  export type SearchProfileAvgAggregateOutputType = {
    rooms: number | null
    priceMin: number | null
    priceMax: number | null
    priceWeight: number | null
    areaMin: number | null
    areaMax: number | null
    areaWeight: number | null
    districtWeight: number | null
    petsWeight: number | null
    parkingWeight: number | null
  }

  export type SearchProfileSumAggregateOutputType = {
    rooms: number | null
    priceMin: number | null
    priceMax: number | null
    priceWeight: number | null
    areaMin: number | null
    areaMax: number | null
    areaWeight: number | null
    districtWeight: number | null
    petsWeight: number | null
    parkingWeight: number | null
  }

  export type SearchProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    rooms: number | null
    priceMin: number | null
    priceMax: number | null
    priceWeight: number | null
    areaMin: number | null
    areaMax: number | null
    areaWeight: number | null
    districts: string | null
    districtWeight: number | null
    petsRequired: boolean | null
    petsWeight: number | null
    parkingRequired: boolean | null
    parkingWeight: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SearchProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    rooms: number | null
    priceMin: number | null
    priceMax: number | null
    priceWeight: number | null
    areaMin: number | null
    areaMax: number | null
    areaWeight: number | null
    districts: string | null
    districtWeight: number | null
    petsRequired: boolean | null
    petsWeight: number | null
    parkingRequired: boolean | null
    parkingWeight: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SearchProfileCountAggregateOutputType = {
    id: number
    name: number
    city: number
    rooms: number
    priceMin: number
    priceMax: number
    priceWeight: number
    areaMin: number
    areaMax: number
    areaWeight: number
    districts: number
    districtWeight: number
    petsRequired: number
    petsWeight: number
    parkingRequired: number
    parkingWeight: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SearchProfileAvgAggregateInputType = {
    rooms?: true
    priceMin?: true
    priceMax?: true
    priceWeight?: true
    areaMin?: true
    areaMax?: true
    areaWeight?: true
    districtWeight?: true
    petsWeight?: true
    parkingWeight?: true
  }

  export type SearchProfileSumAggregateInputType = {
    rooms?: true
    priceMin?: true
    priceMax?: true
    priceWeight?: true
    areaMin?: true
    areaMax?: true
    areaWeight?: true
    districtWeight?: true
    petsWeight?: true
    parkingWeight?: true
  }

  export type SearchProfileMinAggregateInputType = {
    id?: true
    name?: true
    city?: true
    rooms?: true
    priceMin?: true
    priceMax?: true
    priceWeight?: true
    areaMin?: true
    areaMax?: true
    areaWeight?: true
    districts?: true
    districtWeight?: true
    petsRequired?: true
    petsWeight?: true
    parkingRequired?: true
    parkingWeight?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SearchProfileMaxAggregateInputType = {
    id?: true
    name?: true
    city?: true
    rooms?: true
    priceMin?: true
    priceMax?: true
    priceWeight?: true
    areaMin?: true
    areaMax?: true
    areaWeight?: true
    districts?: true
    districtWeight?: true
    petsRequired?: true
    petsWeight?: true
    parkingRequired?: true
    parkingWeight?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SearchProfileCountAggregateInputType = {
    id?: true
    name?: true
    city?: true
    rooms?: true
    priceMin?: true
    priceMax?: true
    priceWeight?: true
    areaMin?: true
    areaMax?: true
    areaWeight?: true
    districts?: true
    districtWeight?: true
    petsRequired?: true
    petsWeight?: true
    parkingRequired?: true
    parkingWeight?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SearchProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchProfile to aggregate.
     */
    where?: SearchProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchProfiles to fetch.
     */
    orderBy?: SearchProfileOrderByWithRelationInput | SearchProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SearchProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SearchProfiles
    **/
    _count?: true | SearchProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SearchProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SearchProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SearchProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SearchProfileMaxAggregateInputType
  }

  export type GetSearchProfileAggregateType<T extends SearchProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateSearchProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSearchProfile[P]>
      : GetScalarType<T[P], AggregateSearchProfile[P]>
  }




  export type SearchProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SearchProfileWhereInput
    orderBy?: SearchProfileOrderByWithAggregationInput | SearchProfileOrderByWithAggregationInput[]
    by: SearchProfileScalarFieldEnum[] | SearchProfileScalarFieldEnum
    having?: SearchProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SearchProfileCountAggregateInputType | true
    _avg?: SearchProfileAvgAggregateInputType
    _sum?: SearchProfileSumAggregateInputType
    _min?: SearchProfileMinAggregateInputType
    _max?: SearchProfileMaxAggregateInputType
  }

  export type SearchProfileGroupByOutputType = {
    id: string
    name: string
    city: string
    rooms: number
    priceMin: number | null
    priceMax: number | null
    priceWeight: number
    areaMin: number | null
    areaMax: number | null
    areaWeight: number
    districts: string
    districtWeight: number
    petsRequired: boolean
    petsWeight: number
    parkingRequired: boolean
    parkingWeight: number
    createdAt: Date
    updatedAt: Date
    _count: SearchProfileCountAggregateOutputType | null
    _avg: SearchProfileAvgAggregateOutputType | null
    _sum: SearchProfileSumAggregateOutputType | null
    _min: SearchProfileMinAggregateOutputType | null
    _max: SearchProfileMaxAggregateOutputType | null
  }

  type GetSearchProfileGroupByPayload<T extends SearchProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SearchProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SearchProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SearchProfileGroupByOutputType[P]>
            : GetScalarType<T[P], SearchProfileGroupByOutputType[P]>
        }
      >
    >


  export type SearchProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    rooms?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceWeight?: boolean
    areaMin?: boolean
    areaMax?: boolean
    areaWeight?: boolean
    districts?: boolean
    districtWeight?: boolean
    petsRequired?: boolean
    petsWeight?: boolean
    parkingRequired?: boolean
    parkingWeight?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listings?: boolean | SearchProfile$listingsArgs<ExtArgs>
    runs?: boolean | SearchProfile$runsArgs<ExtArgs>
    _count?: boolean | SearchProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["searchProfile"]>

  export type SearchProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    rooms?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceWeight?: boolean
    areaMin?: boolean
    areaMax?: boolean
    areaWeight?: boolean
    districts?: boolean
    districtWeight?: boolean
    petsRequired?: boolean
    petsWeight?: boolean
    parkingRequired?: boolean
    parkingWeight?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["searchProfile"]>

  export type SearchProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    rooms?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceWeight?: boolean
    areaMin?: boolean
    areaMax?: boolean
    areaWeight?: boolean
    districts?: boolean
    districtWeight?: boolean
    petsRequired?: boolean
    petsWeight?: boolean
    parkingRequired?: boolean
    parkingWeight?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["searchProfile"]>

  export type SearchProfileSelectScalar = {
    id?: boolean
    name?: boolean
    city?: boolean
    rooms?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceWeight?: boolean
    areaMin?: boolean
    areaMax?: boolean
    areaWeight?: boolean
    districts?: boolean
    districtWeight?: boolean
    petsRequired?: boolean
    petsWeight?: boolean
    parkingRequired?: boolean
    parkingWeight?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SearchProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "city" | "rooms" | "priceMin" | "priceMax" | "priceWeight" | "areaMin" | "areaMax" | "areaWeight" | "districts" | "districtWeight" | "petsRequired" | "petsWeight" | "parkingRequired" | "parkingWeight" | "createdAt" | "updatedAt", ExtArgs["result"]["searchProfile"]>
  export type SearchProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listings?: boolean | SearchProfile$listingsArgs<ExtArgs>
    runs?: boolean | SearchProfile$runsArgs<ExtArgs>
    _count?: boolean | SearchProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SearchProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SearchProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SearchProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SearchProfile"
    objects: {
      listings: Prisma.$ListingPayload<ExtArgs>[]
      runs: Prisma.$ScrapeRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      city: string
      rooms: number
      priceMin: number | null
      priceMax: number | null
      priceWeight: number
      areaMin: number | null
      areaMax: number | null
      areaWeight: number
      districts: string
      districtWeight: number
      petsRequired: boolean
      petsWeight: number
      parkingRequired: boolean
      parkingWeight: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["searchProfile"]>
    composites: {}
  }

  type SearchProfileGetPayload<S extends boolean | null | undefined | SearchProfileDefaultArgs> = $Result.GetResult<Prisma.$SearchProfilePayload, S>

  type SearchProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SearchProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SearchProfileCountAggregateInputType | true
    }

  export interface SearchProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SearchProfile'], meta: { name: 'SearchProfile' } }
    /**
     * Find zero or one SearchProfile that matches the filter.
     * @param {SearchProfileFindUniqueArgs} args - Arguments to find a SearchProfile
     * @example
     * // Get one SearchProfile
     * const searchProfile = await prisma.searchProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SearchProfileFindUniqueArgs>(args: SelectSubset<T, SearchProfileFindUniqueArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SearchProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SearchProfileFindUniqueOrThrowArgs} args - Arguments to find a SearchProfile
     * @example
     * // Get one SearchProfile
     * const searchProfile = await prisma.searchProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SearchProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, SearchProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileFindFirstArgs} args - Arguments to find a SearchProfile
     * @example
     * // Get one SearchProfile
     * const searchProfile = await prisma.searchProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SearchProfileFindFirstArgs>(args?: SelectSubset<T, SearchProfileFindFirstArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileFindFirstOrThrowArgs} args - Arguments to find a SearchProfile
     * @example
     * // Get one SearchProfile
     * const searchProfile = await prisma.searchProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SearchProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, SearchProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SearchProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SearchProfiles
     * const searchProfiles = await prisma.searchProfile.findMany()
     * 
     * // Get first 10 SearchProfiles
     * const searchProfiles = await prisma.searchProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const searchProfileWithIdOnly = await prisma.searchProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SearchProfileFindManyArgs>(args?: SelectSubset<T, SearchProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SearchProfile.
     * @param {SearchProfileCreateArgs} args - Arguments to create a SearchProfile.
     * @example
     * // Create one SearchProfile
     * const SearchProfile = await prisma.searchProfile.create({
     *   data: {
     *     // ... data to create a SearchProfile
     *   }
     * })
     * 
     */
    create<T extends SearchProfileCreateArgs>(args: SelectSubset<T, SearchProfileCreateArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SearchProfiles.
     * @param {SearchProfileCreateManyArgs} args - Arguments to create many SearchProfiles.
     * @example
     * // Create many SearchProfiles
     * const searchProfile = await prisma.searchProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SearchProfileCreateManyArgs>(args?: SelectSubset<T, SearchProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SearchProfiles and returns the data saved in the database.
     * @param {SearchProfileCreateManyAndReturnArgs} args - Arguments to create many SearchProfiles.
     * @example
     * // Create many SearchProfiles
     * const searchProfile = await prisma.searchProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SearchProfiles and only return the `id`
     * const searchProfileWithIdOnly = await prisma.searchProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SearchProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, SearchProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SearchProfile.
     * @param {SearchProfileDeleteArgs} args - Arguments to delete one SearchProfile.
     * @example
     * // Delete one SearchProfile
     * const SearchProfile = await prisma.searchProfile.delete({
     *   where: {
     *     // ... filter to delete one SearchProfile
     *   }
     * })
     * 
     */
    delete<T extends SearchProfileDeleteArgs>(args: SelectSubset<T, SearchProfileDeleteArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SearchProfile.
     * @param {SearchProfileUpdateArgs} args - Arguments to update one SearchProfile.
     * @example
     * // Update one SearchProfile
     * const searchProfile = await prisma.searchProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SearchProfileUpdateArgs>(args: SelectSubset<T, SearchProfileUpdateArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SearchProfiles.
     * @param {SearchProfileDeleteManyArgs} args - Arguments to filter SearchProfiles to delete.
     * @example
     * // Delete a few SearchProfiles
     * const { count } = await prisma.searchProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SearchProfileDeleteManyArgs>(args?: SelectSubset<T, SearchProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SearchProfiles
     * const searchProfile = await prisma.searchProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SearchProfileUpdateManyArgs>(args: SelectSubset<T, SearchProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchProfiles and returns the data updated in the database.
     * @param {SearchProfileUpdateManyAndReturnArgs} args - Arguments to update many SearchProfiles.
     * @example
     * // Update many SearchProfiles
     * const searchProfile = await prisma.searchProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SearchProfiles and only return the `id`
     * const searchProfileWithIdOnly = await prisma.searchProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SearchProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, SearchProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SearchProfile.
     * @param {SearchProfileUpsertArgs} args - Arguments to update or create a SearchProfile.
     * @example
     * // Update or create a SearchProfile
     * const searchProfile = await prisma.searchProfile.upsert({
     *   create: {
     *     // ... data to create a SearchProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SearchProfile we want to update
     *   }
     * })
     */
    upsert<T extends SearchProfileUpsertArgs>(args: SelectSubset<T, SearchProfileUpsertArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SearchProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileCountArgs} args - Arguments to filter SearchProfiles to count.
     * @example
     * // Count the number of SearchProfiles
     * const count = await prisma.searchProfile.count({
     *   where: {
     *     // ... the filter for the SearchProfiles we want to count
     *   }
     * })
    **/
    count<T extends SearchProfileCountArgs>(
      args?: Subset<T, SearchProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SearchProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SearchProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SearchProfileAggregateArgs>(args: Subset<T, SearchProfileAggregateArgs>): Prisma.PrismaPromise<GetSearchProfileAggregateType<T>>

    /**
     * Group by SearchProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SearchProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SearchProfileGroupByArgs['orderBy'] }
        : { orderBy?: SearchProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SearchProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSearchProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SearchProfile model
   */
  readonly fields: SearchProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SearchProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SearchProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listings<T extends SearchProfile$listingsArgs<ExtArgs> = {}>(args?: Subset<T, SearchProfile$listingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    runs<T extends SearchProfile$runsArgs<ExtArgs> = {}>(args?: Subset<T, SearchProfile$runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SearchProfile model
   */
  interface SearchProfileFieldRefs {
    readonly id: FieldRef<"SearchProfile", 'String'>
    readonly name: FieldRef<"SearchProfile", 'String'>
    readonly city: FieldRef<"SearchProfile", 'String'>
    readonly rooms: FieldRef<"SearchProfile", 'Int'>
    readonly priceMin: FieldRef<"SearchProfile", 'Int'>
    readonly priceMax: FieldRef<"SearchProfile", 'Int'>
    readonly priceWeight: FieldRef<"SearchProfile", 'Int'>
    readonly areaMin: FieldRef<"SearchProfile", 'Int'>
    readonly areaMax: FieldRef<"SearchProfile", 'Int'>
    readonly areaWeight: FieldRef<"SearchProfile", 'Int'>
    readonly districts: FieldRef<"SearchProfile", 'String'>
    readonly districtWeight: FieldRef<"SearchProfile", 'Int'>
    readonly petsRequired: FieldRef<"SearchProfile", 'Boolean'>
    readonly petsWeight: FieldRef<"SearchProfile", 'Int'>
    readonly parkingRequired: FieldRef<"SearchProfile", 'Boolean'>
    readonly parkingWeight: FieldRef<"SearchProfile", 'Int'>
    readonly createdAt: FieldRef<"SearchProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"SearchProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SearchProfile findUnique
   */
  export type SearchProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter, which SearchProfile to fetch.
     */
    where: SearchProfileWhereUniqueInput
  }

  /**
   * SearchProfile findUniqueOrThrow
   */
  export type SearchProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter, which SearchProfile to fetch.
     */
    where: SearchProfileWhereUniqueInput
  }

  /**
   * SearchProfile findFirst
   */
  export type SearchProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter, which SearchProfile to fetch.
     */
    where?: SearchProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchProfiles to fetch.
     */
    orderBy?: SearchProfileOrderByWithRelationInput | SearchProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchProfiles.
     */
    cursor?: SearchProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchProfiles.
     */
    distinct?: SearchProfileScalarFieldEnum | SearchProfileScalarFieldEnum[]
  }

  /**
   * SearchProfile findFirstOrThrow
   */
  export type SearchProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter, which SearchProfile to fetch.
     */
    where?: SearchProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchProfiles to fetch.
     */
    orderBy?: SearchProfileOrderByWithRelationInput | SearchProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchProfiles.
     */
    cursor?: SearchProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchProfiles.
     */
    distinct?: SearchProfileScalarFieldEnum | SearchProfileScalarFieldEnum[]
  }

  /**
   * SearchProfile findMany
   */
  export type SearchProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter, which SearchProfiles to fetch.
     */
    where?: SearchProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchProfiles to fetch.
     */
    orderBy?: SearchProfileOrderByWithRelationInput | SearchProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SearchProfiles.
     */
    cursor?: SearchProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchProfiles.
     */
    skip?: number
    distinct?: SearchProfileScalarFieldEnum | SearchProfileScalarFieldEnum[]
  }

  /**
   * SearchProfile create
   */
  export type SearchProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a SearchProfile.
     */
    data: XOR<SearchProfileCreateInput, SearchProfileUncheckedCreateInput>
  }

  /**
   * SearchProfile createMany
   */
  export type SearchProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SearchProfiles.
     */
    data: SearchProfileCreateManyInput | SearchProfileCreateManyInput[]
  }

  /**
   * SearchProfile createManyAndReturn
   */
  export type SearchProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * The data used to create many SearchProfiles.
     */
    data: SearchProfileCreateManyInput | SearchProfileCreateManyInput[]
  }

  /**
   * SearchProfile update
   */
  export type SearchProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a SearchProfile.
     */
    data: XOR<SearchProfileUpdateInput, SearchProfileUncheckedUpdateInput>
    /**
     * Choose, which SearchProfile to update.
     */
    where: SearchProfileWhereUniqueInput
  }

  /**
   * SearchProfile updateMany
   */
  export type SearchProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SearchProfiles.
     */
    data: XOR<SearchProfileUpdateManyMutationInput, SearchProfileUncheckedUpdateManyInput>
    /**
     * Filter which SearchProfiles to update
     */
    where?: SearchProfileWhereInput
    /**
     * Limit how many SearchProfiles to update.
     */
    limit?: number
  }

  /**
   * SearchProfile updateManyAndReturn
   */
  export type SearchProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * The data used to update SearchProfiles.
     */
    data: XOR<SearchProfileUpdateManyMutationInput, SearchProfileUncheckedUpdateManyInput>
    /**
     * Filter which SearchProfiles to update
     */
    where?: SearchProfileWhereInput
    /**
     * Limit how many SearchProfiles to update.
     */
    limit?: number
  }

  /**
   * SearchProfile upsert
   */
  export type SearchProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the SearchProfile to update in case it exists.
     */
    where: SearchProfileWhereUniqueInput
    /**
     * In case the SearchProfile found by the `where` argument doesn't exist, create a new SearchProfile with this data.
     */
    create: XOR<SearchProfileCreateInput, SearchProfileUncheckedCreateInput>
    /**
     * In case the SearchProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SearchProfileUpdateInput, SearchProfileUncheckedUpdateInput>
  }

  /**
   * SearchProfile delete
   */
  export type SearchProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
    /**
     * Filter which SearchProfile to delete.
     */
    where: SearchProfileWhereUniqueInput
  }

  /**
   * SearchProfile deleteMany
   */
  export type SearchProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchProfiles to delete
     */
    where?: SearchProfileWhereInput
    /**
     * Limit how many SearchProfiles to delete.
     */
    limit?: number
  }

  /**
   * SearchProfile.listings
   */
  export type SearchProfile$listingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    cursor?: ListingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * SearchProfile.runs
   */
  export type SearchProfile$runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    where?: ScrapeRunWhereInput
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    cursor?: ScrapeRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * SearchProfile without action
   */
  export type SearchProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchProfile
     */
    select?: SearchProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchProfile
     */
    omit?: SearchProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SearchProfileInclude<ExtArgs> | null
  }


  /**
   * Model Listing
   */

  export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  export type ListingAvgAggregateOutputType = {
    price: number | null
    rentExtra: number | null
    area: number | null
    rooms: number | null
    score: number | null
  }

  export type ListingSumAggregateOutputType = {
    price: number | null
    rentExtra: number | null
    area: number | null
    rooms: number | null
    score: number | null
  }

  export type ListingMinAggregateOutputType = {
    id: string | null
    source: string | null
    externalId: string | null
    url: string | null
    title: string | null
    description: string | null
    price: number | null
    rentExtra: number | null
    area: number | null
    rooms: number | null
    city: string | null
    district: string | null
    petsAllowed: boolean | null
    hasParking: boolean | null
    imageUrl: string | null
    score: number | null
    aiSummary: string | null
    aiExtracted: string | null
    status: string | null
    rejectReason: string | null
    hidden: boolean | null
    favorite: boolean | null
    scrapedAt: Date | null
    profileId: string | null
  }

  export type ListingMaxAggregateOutputType = {
    id: string | null
    source: string | null
    externalId: string | null
    url: string | null
    title: string | null
    description: string | null
    price: number | null
    rentExtra: number | null
    area: number | null
    rooms: number | null
    city: string | null
    district: string | null
    petsAllowed: boolean | null
    hasParking: boolean | null
    imageUrl: string | null
    score: number | null
    aiSummary: string | null
    aiExtracted: string | null
    status: string | null
    rejectReason: string | null
    hidden: boolean | null
    favorite: boolean | null
    scrapedAt: Date | null
    profileId: string | null
  }

  export type ListingCountAggregateOutputType = {
    id: number
    source: number
    externalId: number
    url: number
    title: number
    description: number
    price: number
    rentExtra: number
    area: number
    rooms: number
    city: number
    district: number
    petsAllowed: number
    hasParking: number
    imageUrl: number
    score: number
    aiSummary: number
    aiExtracted: number
    status: number
    rejectReason: number
    hidden: number
    favorite: number
    scrapedAt: number
    profileId: number
    _all: number
  }


  export type ListingAvgAggregateInputType = {
    price?: true
    rentExtra?: true
    area?: true
    rooms?: true
    score?: true
  }

  export type ListingSumAggregateInputType = {
    price?: true
    rentExtra?: true
    area?: true
    rooms?: true
    score?: true
  }

  export type ListingMinAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    url?: true
    title?: true
    description?: true
    price?: true
    rentExtra?: true
    area?: true
    rooms?: true
    city?: true
    district?: true
    petsAllowed?: true
    hasParking?: true
    imageUrl?: true
    score?: true
    aiSummary?: true
    aiExtracted?: true
    status?: true
    rejectReason?: true
    hidden?: true
    favorite?: true
    scrapedAt?: true
    profileId?: true
  }

  export type ListingMaxAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    url?: true
    title?: true
    description?: true
    price?: true
    rentExtra?: true
    area?: true
    rooms?: true
    city?: true
    district?: true
    petsAllowed?: true
    hasParking?: true
    imageUrl?: true
    score?: true
    aiSummary?: true
    aiExtracted?: true
    status?: true
    rejectReason?: true
    hidden?: true
    favorite?: true
    scrapedAt?: true
    profileId?: true
  }

  export type ListingCountAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    url?: true
    title?: true
    description?: true
    price?: true
    rentExtra?: true
    area?: true
    rooms?: true
    city?: true
    district?: true
    petsAllowed?: true
    hasParking?: true
    imageUrl?: true
    score?: true
    aiSummary?: true
    aiExtracted?: true
    status?: true
    rejectReason?: true
    hidden?: true
    favorite?: true
    scrapedAt?: true
    profileId?: true
    _all?: true
  }

  export type ListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listing to aggregate.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Listings
    **/
    _count?: true | ListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingMaxAggregateInputType
  }

  export type GetListingAggregateType<T extends ListingAggregateArgs> = {
        [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListing[P]>
      : GetScalarType<T[P], AggregateListing[P]>
  }




  export type ListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithAggregationInput | ListingOrderByWithAggregationInput[]
    by: ListingScalarFieldEnum[] | ListingScalarFieldEnum
    having?: ListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingCountAggregateInputType | true
    _avg?: ListingAvgAggregateInputType
    _sum?: ListingSumAggregateInputType
    _min?: ListingMinAggregateInputType
    _max?: ListingMaxAggregateInputType
  }

  export type ListingGroupByOutputType = {
    id: string
    source: string
    externalId: string
    url: string
    title: string
    description: string | null
    price: number | null
    rentExtra: number | null
    area: number | null
    rooms: number | null
    city: string | null
    district: string | null
    petsAllowed: boolean | null
    hasParking: boolean | null
    imageUrl: string | null
    score: number | null
    aiSummary: string | null
    aiExtracted: string | null
    status: string
    rejectReason: string | null
    hidden: boolean
    favorite: boolean
    scrapedAt: Date
    profileId: string
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  type GetListingGroupByPayload<T extends ListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingGroupByOutputType[P]>
            : GetScalarType<T[P], ListingGroupByOutputType[P]>
        }
      >
    >


  export type ListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    rentExtra?: boolean
    area?: boolean
    rooms?: boolean
    city?: boolean
    district?: boolean
    petsAllowed?: boolean
    hasParking?: boolean
    imageUrl?: boolean
    score?: boolean
    aiSummary?: boolean
    aiExtracted?: boolean
    status?: boolean
    rejectReason?: boolean
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: boolean
    profileId?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    rentExtra?: boolean
    area?: boolean
    rooms?: boolean
    city?: boolean
    district?: boolean
    petsAllowed?: boolean
    hasParking?: boolean
    imageUrl?: boolean
    score?: boolean
    aiSummary?: boolean
    aiExtracted?: boolean
    status?: boolean
    rejectReason?: boolean
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: boolean
    profileId?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    rentExtra?: boolean
    area?: boolean
    rooms?: boolean
    city?: boolean
    district?: boolean
    petsAllowed?: boolean
    hasParking?: boolean
    imageUrl?: boolean
    score?: boolean
    aiSummary?: boolean
    aiExtracted?: boolean
    status?: boolean
    rejectReason?: boolean
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: boolean
    profileId?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectScalar = {
    id?: boolean
    source?: boolean
    externalId?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    rentExtra?: boolean
    area?: boolean
    rooms?: boolean
    city?: boolean
    district?: boolean
    petsAllowed?: boolean
    hasParking?: boolean
    imageUrl?: boolean
    score?: boolean
    aiSummary?: boolean
    aiExtracted?: boolean
    status?: boolean
    rejectReason?: boolean
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: boolean
    profileId?: boolean
  }

  export type ListingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "source" | "externalId" | "url" | "title" | "description" | "price" | "rentExtra" | "area" | "rooms" | "city" | "district" | "petsAllowed" | "hasParking" | "imageUrl" | "score" | "aiSummary" | "aiExtracted" | "status" | "rejectReason" | "hidden" | "favorite" | "scrapedAt" | "profileId", ExtArgs["result"]["listing"]>
  export type ListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }
  export type ListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }
  export type ListingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }

  export type $ListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Listing"
    objects: {
      profile: Prisma.$SearchProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      source: string
      externalId: string
      url: string
      title: string
      description: string | null
      price: number | null
      rentExtra: number | null
      area: number | null
      rooms: number | null
      city: string | null
      district: string | null
      petsAllowed: boolean | null
      hasParking: boolean | null
      imageUrl: string | null
      score: number | null
      aiSummary: string | null
      aiExtracted: string | null
      status: string
      rejectReason: string | null
      hidden: boolean
      favorite: boolean
      scrapedAt: Date
      profileId: string
    }, ExtArgs["result"]["listing"]>
    composites: {}
  }

  type ListingGetPayload<S extends boolean | null | undefined | ListingDefaultArgs> = $Result.GetResult<Prisma.$ListingPayload, S>

  type ListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ListingCountAggregateInputType | true
    }

  export interface ListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Listing'], meta: { name: 'Listing' } }
    /**
     * Find zero or one Listing that matches the filter.
     * @param {ListingFindUniqueArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingFindUniqueArgs>(args: SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Listing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ListingFindUniqueOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(args: SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Listing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingFindFirstArgs>(args?: SelectSubset<T, ListingFindFirstArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Listing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(args?: SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Listings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listings
     * const listings = await prisma.listing.findMany()
     * 
     * // Get first 10 Listings
     * const listings = await prisma.listing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingWithIdOnly = await prisma.listing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListingFindManyArgs>(args?: SelectSubset<T, ListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Listing.
     * @param {ListingCreateArgs} args - Arguments to create a Listing.
     * @example
     * // Create one Listing
     * const Listing = await prisma.listing.create({
     *   data: {
     *     // ... data to create a Listing
     *   }
     * })
     * 
     */
    create<T extends ListingCreateArgs>(args: SelectSubset<T, ListingCreateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Listings.
     * @param {ListingCreateManyArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListingCreateManyArgs>(args?: SelectSubset<T, ListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Listings and returns the data saved in the database.
     * @param {ListingCreateManyAndReturnArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(args?: SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Listing.
     * @param {ListingDeleteArgs} args - Arguments to delete one Listing.
     * @example
     * // Delete one Listing
     * const Listing = await prisma.listing.delete({
     *   where: {
     *     // ... filter to delete one Listing
     *   }
     * })
     * 
     */
    delete<T extends ListingDeleteArgs>(args: SelectSubset<T, ListingDeleteArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Listing.
     * @param {ListingUpdateArgs} args - Arguments to update one Listing.
     * @example
     * // Update one Listing
     * const listing = await prisma.listing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListingUpdateArgs>(args: SelectSubset<T, ListingUpdateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Listings.
     * @param {ListingDeleteManyArgs} args - Arguments to filter Listings to delete.
     * @example
     * // Delete a few Listings
     * const { count } = await prisma.listing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListingDeleteManyArgs>(args?: SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListingUpdateManyArgs>(args: SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings and returns the data updated in the database.
     * @param {ListingUpdateManyAndReturnArgs} args - Arguments to update many Listings.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ListingUpdateManyAndReturnArgs>(args: SelectSubset<T, ListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Listing.
     * @param {ListingUpsertArgs} args - Arguments to update or create a Listing.
     * @example
     * // Update or create a Listing
     * const listing = await prisma.listing.upsert({
     *   create: {
     *     // ... data to create a Listing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listing we want to update
     *   }
     * })
     */
    upsert<T extends ListingUpsertArgs>(args: SelectSubset<T, ListingUpsertArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingCountArgs} args - Arguments to filter Listings to count.
     * @example
     * // Count the number of Listings
     * const count = await prisma.listing.count({
     *   where: {
     *     // ... the filter for the Listings we want to count
     *   }
     * })
    **/
    count<T extends ListingCountArgs>(
      args?: Subset<T, ListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingAggregateArgs>(args: Subset<T, ListingAggregateArgs>): Prisma.PrismaPromise<GetListingAggregateType<T>>

    /**
     * Group by Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingGroupByArgs['orderBy'] }
        : { orderBy?: ListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Listing model
   */
  readonly fields: ListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends SearchProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SearchProfileDefaultArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Listing model
   */
  interface ListingFieldRefs {
    readonly id: FieldRef<"Listing", 'String'>
    readonly source: FieldRef<"Listing", 'String'>
    readonly externalId: FieldRef<"Listing", 'String'>
    readonly url: FieldRef<"Listing", 'String'>
    readonly title: FieldRef<"Listing", 'String'>
    readonly description: FieldRef<"Listing", 'String'>
    readonly price: FieldRef<"Listing", 'Int'>
    readonly rentExtra: FieldRef<"Listing", 'Int'>
    readonly area: FieldRef<"Listing", 'Float'>
    readonly rooms: FieldRef<"Listing", 'Int'>
    readonly city: FieldRef<"Listing", 'String'>
    readonly district: FieldRef<"Listing", 'String'>
    readonly petsAllowed: FieldRef<"Listing", 'Boolean'>
    readonly hasParking: FieldRef<"Listing", 'Boolean'>
    readonly imageUrl: FieldRef<"Listing", 'String'>
    readonly score: FieldRef<"Listing", 'Float'>
    readonly aiSummary: FieldRef<"Listing", 'String'>
    readonly aiExtracted: FieldRef<"Listing", 'String'>
    readonly status: FieldRef<"Listing", 'String'>
    readonly rejectReason: FieldRef<"Listing", 'String'>
    readonly hidden: FieldRef<"Listing", 'Boolean'>
    readonly favorite: FieldRef<"Listing", 'Boolean'>
    readonly scrapedAt: FieldRef<"Listing", 'DateTime'>
    readonly profileId: FieldRef<"Listing", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Listing findUnique
   */
  export type ListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findUniqueOrThrow
   */
  export type ListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findFirst
   */
  export type ListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findFirstOrThrow
   */
  export type ListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findMany
   */
  export type ListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listings to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing create
   */
  export type ListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to create a Listing.
     */
    data: XOR<ListingCreateInput, ListingUncheckedCreateInput>
  }

  /**
   * Listing createMany
   */
  export type ListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
  }

  /**
   * Listing createManyAndReturn
   */
  export type ListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Listing update
   */
  export type ListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to update a Listing.
     */
    data: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
    /**
     * Choose, which Listing to update.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing updateMany
   */
  export type ListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to update.
     */
    limit?: number
  }

  /**
   * Listing updateManyAndReturn
   */
  export type ListingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Listing upsert
   */
  export type ListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The filter to search for the Listing to update in case it exists.
     */
    where: ListingWhereUniqueInput
    /**
     * In case the Listing found by the `where` argument doesn't exist, create a new Listing with this data.
     */
    create: XOR<ListingCreateInput, ListingUncheckedCreateInput>
    /**
     * In case the Listing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
  }

  /**
   * Listing delete
   */
  export type ListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter which Listing to delete.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing deleteMany
   */
  export type ListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listings to delete
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to delete.
     */
    limit?: number
  }

  /**
   * Listing without action
   */
  export type ListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
  }


  /**
   * Model ScrapeRun
   */

  export type AggregateScrapeRun = {
    _count: ScrapeRunCountAggregateOutputType | null
    _min: ScrapeRunMinAggregateOutputType | null
    _max: ScrapeRunMaxAggregateOutputType | null
  }

  export type ScrapeRunMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    status: string | null
    currentStep: string | null
    statsJson: string | null
    error: string | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type ScrapeRunMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    status: string | null
    currentStep: string | null
    statsJson: string | null
    error: string | null
    startedAt: Date | null
    finishedAt: Date | null
  }

  export type ScrapeRunCountAggregateOutputType = {
    id: number
    profileId: number
    status: number
    currentStep: number
    statsJson: number
    error: number
    startedAt: number
    finishedAt: number
    _all: number
  }


  export type ScrapeRunMinAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    currentStep?: true
    statsJson?: true
    error?: true
    startedAt?: true
    finishedAt?: true
  }

  export type ScrapeRunMaxAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    currentStep?: true
    statsJson?: true
    error?: true
    startedAt?: true
    finishedAt?: true
  }

  export type ScrapeRunCountAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    currentStep?: true
    statsJson?: true
    error?: true
    startedAt?: true
    finishedAt?: true
    _all?: true
  }

  export type ScrapeRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeRun to aggregate.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapeRuns
    **/
    _count?: true | ScrapeRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapeRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapeRunMaxAggregateInputType
  }

  export type GetScrapeRunAggregateType<T extends ScrapeRunAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapeRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapeRun[P]>
      : GetScalarType<T[P], AggregateScrapeRun[P]>
  }




  export type ScrapeRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeRunWhereInput
    orderBy?: ScrapeRunOrderByWithAggregationInput | ScrapeRunOrderByWithAggregationInput[]
    by: ScrapeRunScalarFieldEnum[] | ScrapeRunScalarFieldEnum
    having?: ScrapeRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapeRunCountAggregateInputType | true
    _min?: ScrapeRunMinAggregateInputType
    _max?: ScrapeRunMaxAggregateInputType
  }

  export type ScrapeRunGroupByOutputType = {
    id: string
    profileId: string
    status: string
    currentStep: string | null
    statsJson: string
    error: string | null
    startedAt: Date
    finishedAt: Date | null
    _count: ScrapeRunCountAggregateOutputType | null
    _min: ScrapeRunMinAggregateOutputType | null
    _max: ScrapeRunMaxAggregateOutputType | null
  }

  type GetScrapeRunGroupByPayload<T extends ScrapeRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScrapeRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapeRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapeRunGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapeRunGroupByOutputType[P]>
        }
      >
    >


  export type ScrapeRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    status?: boolean
    currentStep?: boolean
    statsJson?: boolean
    error?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    status?: boolean
    currentStep?: boolean
    statsJson?: boolean
    error?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    status?: boolean
    currentStep?: boolean
    statsJson?: boolean
    error?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectScalar = {
    id?: boolean
    profileId?: boolean
    status?: boolean
    currentStep?: boolean
    statsJson?: boolean
    error?: boolean
    startedAt?: boolean
    finishedAt?: boolean
  }

  export type ScrapeRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "status" | "currentStep" | "statsJson" | "error" | "startedAt" | "finishedAt", ExtArgs["result"]["scrapeRun"]>
  export type ScrapeRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }
  export type ScrapeRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }
  export type ScrapeRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | SearchProfileDefaultArgs<ExtArgs>
  }

  export type $ScrapeRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScrapeRun"
    objects: {
      profile: Prisma.$SearchProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      status: string
      currentStep: string | null
      statsJson: string
      error: string | null
      startedAt: Date
      finishedAt: Date | null
    }, ExtArgs["result"]["scrapeRun"]>
    composites: {}
  }

  type ScrapeRunGetPayload<S extends boolean | null | undefined | ScrapeRunDefaultArgs> = $Result.GetResult<Prisma.$ScrapeRunPayload, S>

  type ScrapeRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScrapeRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScrapeRunCountAggregateInputType | true
    }

  export interface ScrapeRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScrapeRun'], meta: { name: 'ScrapeRun' } }
    /**
     * Find zero or one ScrapeRun that matches the filter.
     * @param {ScrapeRunFindUniqueArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapeRunFindUniqueArgs>(args: SelectSubset<T, ScrapeRunFindUniqueArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScrapeRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapeRunFindUniqueOrThrowArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapeRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ScrapeRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindFirstArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapeRunFindFirstArgs>(args?: SelectSubset<T, ScrapeRunFindFirstArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindFirstOrThrowArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapeRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ScrapeRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScrapeRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapeRuns
     * const scrapeRuns = await prisma.scrapeRun.findMany()
     * 
     * // Get first 10 ScrapeRuns
     * const scrapeRuns = await prisma.scrapeRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScrapeRunFindManyArgs>(args?: SelectSubset<T, ScrapeRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScrapeRun.
     * @param {ScrapeRunCreateArgs} args - Arguments to create a ScrapeRun.
     * @example
     * // Create one ScrapeRun
     * const ScrapeRun = await prisma.scrapeRun.create({
     *   data: {
     *     // ... data to create a ScrapeRun
     *   }
     * })
     * 
     */
    create<T extends ScrapeRunCreateArgs>(args: SelectSubset<T, ScrapeRunCreateArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScrapeRuns.
     * @param {ScrapeRunCreateManyArgs} args - Arguments to create many ScrapeRuns.
     * @example
     * // Create many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScrapeRunCreateManyArgs>(args?: SelectSubset<T, ScrapeRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScrapeRuns and returns the data saved in the database.
     * @param {ScrapeRunCreateManyAndReturnArgs} args - Arguments to create many ScrapeRuns.
     * @example
     * // Create many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScrapeRuns and only return the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScrapeRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ScrapeRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScrapeRun.
     * @param {ScrapeRunDeleteArgs} args - Arguments to delete one ScrapeRun.
     * @example
     * // Delete one ScrapeRun
     * const ScrapeRun = await prisma.scrapeRun.delete({
     *   where: {
     *     // ... filter to delete one ScrapeRun
     *   }
     * })
     * 
     */
    delete<T extends ScrapeRunDeleteArgs>(args: SelectSubset<T, ScrapeRunDeleteArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScrapeRun.
     * @param {ScrapeRunUpdateArgs} args - Arguments to update one ScrapeRun.
     * @example
     * // Update one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScrapeRunUpdateArgs>(args: SelectSubset<T, ScrapeRunUpdateArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScrapeRuns.
     * @param {ScrapeRunDeleteManyArgs} args - Arguments to filter ScrapeRuns to delete.
     * @example
     * // Delete a few ScrapeRuns
     * const { count } = await prisma.scrapeRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScrapeRunDeleteManyArgs>(args?: SelectSubset<T, ScrapeRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScrapeRunUpdateManyArgs>(args: SelectSubset<T, ScrapeRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeRuns and returns the data updated in the database.
     * @param {ScrapeRunUpdateManyAndReturnArgs} args - Arguments to update many ScrapeRuns.
     * @example
     * // Update many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScrapeRuns and only return the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScrapeRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ScrapeRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScrapeRun.
     * @param {ScrapeRunUpsertArgs} args - Arguments to update or create a ScrapeRun.
     * @example
     * // Update or create a ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.upsert({
     *   create: {
     *     // ... data to create a ScrapeRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapeRun we want to update
     *   }
     * })
     */
    upsert<T extends ScrapeRunUpsertArgs>(args: SelectSubset<T, ScrapeRunUpsertArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScrapeRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunCountArgs} args - Arguments to filter ScrapeRuns to count.
     * @example
     * // Count the number of ScrapeRuns
     * const count = await prisma.scrapeRun.count({
     *   where: {
     *     // ... the filter for the ScrapeRuns we want to count
     *   }
     * })
    **/
    count<T extends ScrapeRunCountArgs>(
      args?: Subset<T, ScrapeRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapeRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapeRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScrapeRunAggregateArgs>(args: Subset<T, ScrapeRunAggregateArgs>): Prisma.PrismaPromise<GetScrapeRunAggregateType<T>>

    /**
     * Group by ScrapeRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScrapeRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapeRunGroupByArgs['orderBy'] }
        : { orderBy?: ScrapeRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScrapeRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapeRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScrapeRun model
   */
  readonly fields: ScrapeRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapeRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScrapeRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends SearchProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SearchProfileDefaultArgs<ExtArgs>>): Prisma__SearchProfileClient<$Result.GetResult<Prisma.$SearchProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScrapeRun model
   */
  interface ScrapeRunFieldRefs {
    readonly id: FieldRef<"ScrapeRun", 'String'>
    readonly profileId: FieldRef<"ScrapeRun", 'String'>
    readonly status: FieldRef<"ScrapeRun", 'String'>
    readonly currentStep: FieldRef<"ScrapeRun", 'String'>
    readonly statsJson: FieldRef<"ScrapeRun", 'String'>
    readonly error: FieldRef<"ScrapeRun", 'String'>
    readonly startedAt: FieldRef<"ScrapeRun", 'DateTime'>
    readonly finishedAt: FieldRef<"ScrapeRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScrapeRun findUnique
   */
  export type ScrapeRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun findUniqueOrThrow
   */
  export type ScrapeRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun findFirst
   */
  export type ScrapeRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeRuns.
     */
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun findFirstOrThrow
   */
  export type ScrapeRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeRuns.
     */
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun findMany
   */
  export type ScrapeRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRuns to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun create
   */
  export type ScrapeRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ScrapeRun.
     */
    data: XOR<ScrapeRunCreateInput, ScrapeRunUncheckedCreateInput>
  }

  /**
   * ScrapeRun createMany
   */
  export type ScrapeRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapeRuns.
     */
    data: ScrapeRunCreateManyInput | ScrapeRunCreateManyInput[]
  }

  /**
   * ScrapeRun createManyAndReturn
   */
  export type ScrapeRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * The data used to create many ScrapeRuns.
     */
    data: ScrapeRunCreateManyInput | ScrapeRunCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapeRun update
   */
  export type ScrapeRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ScrapeRun.
     */
    data: XOR<ScrapeRunUpdateInput, ScrapeRunUncheckedUpdateInput>
    /**
     * Choose, which ScrapeRun to update.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun updateMany
   */
  export type ScrapeRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapeRuns.
     */
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeRuns to update
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to update.
     */
    limit?: number
  }

  /**
   * ScrapeRun updateManyAndReturn
   */
  export type ScrapeRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * The data used to update ScrapeRuns.
     */
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeRuns to update
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapeRun upsert
   */
  export type ScrapeRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ScrapeRun to update in case it exists.
     */
    where: ScrapeRunWhereUniqueInput
    /**
     * In case the ScrapeRun found by the `where` argument doesn't exist, create a new ScrapeRun with this data.
     */
    create: XOR<ScrapeRunCreateInput, ScrapeRunUncheckedCreateInput>
    /**
     * In case the ScrapeRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScrapeRunUpdateInput, ScrapeRunUncheckedUpdateInput>
  }

  /**
   * ScrapeRun delete
   */
  export type ScrapeRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter which ScrapeRun to delete.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun deleteMany
   */
  export type ScrapeRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeRuns to delete
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to delete.
     */
    limit?: number
  }

  /**
   * ScrapeRun without action
   */
  export type ScrapeRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SearchProfileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    city: 'city',
    rooms: 'rooms',
    priceMin: 'priceMin',
    priceMax: 'priceMax',
    priceWeight: 'priceWeight',
    areaMin: 'areaMin',
    areaMax: 'areaMax',
    areaWeight: 'areaWeight',
    districts: 'districts',
    districtWeight: 'districtWeight',
    petsRequired: 'petsRequired',
    petsWeight: 'petsWeight',
    parkingRequired: 'parkingRequired',
    parkingWeight: 'parkingWeight',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SearchProfileScalarFieldEnum = (typeof SearchProfileScalarFieldEnum)[keyof typeof SearchProfileScalarFieldEnum]


  export const ListingScalarFieldEnum: {
    id: 'id',
    source: 'source',
    externalId: 'externalId',
    url: 'url',
    title: 'title',
    description: 'description',
    price: 'price',
    rentExtra: 'rentExtra',
    area: 'area',
    rooms: 'rooms',
    city: 'city',
    district: 'district',
    petsAllowed: 'petsAllowed',
    hasParking: 'hasParking',
    imageUrl: 'imageUrl',
    score: 'score',
    aiSummary: 'aiSummary',
    aiExtracted: 'aiExtracted',
    status: 'status',
    rejectReason: 'rejectReason',
    hidden: 'hidden',
    favorite: 'favorite',
    scrapedAt: 'scrapedAt',
    profileId: 'profileId'
  };

  export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum]


  export const ScrapeRunScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    status: 'status',
    currentStep: 'currentStep',
    statsJson: 'statsJson',
    error: 'error',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt'
  };

  export type ScrapeRunScalarFieldEnum = (typeof ScrapeRunScalarFieldEnum)[keyof typeof ScrapeRunScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type SearchProfileWhereInput = {
    AND?: SearchProfileWhereInput | SearchProfileWhereInput[]
    OR?: SearchProfileWhereInput[]
    NOT?: SearchProfileWhereInput | SearchProfileWhereInput[]
    id?: StringFilter<"SearchProfile"> | string
    name?: StringFilter<"SearchProfile"> | string
    city?: StringFilter<"SearchProfile"> | string
    rooms?: IntFilter<"SearchProfile"> | number
    priceMin?: IntNullableFilter<"SearchProfile"> | number | null
    priceMax?: IntNullableFilter<"SearchProfile"> | number | null
    priceWeight?: IntFilter<"SearchProfile"> | number
    areaMin?: IntNullableFilter<"SearchProfile"> | number | null
    areaMax?: IntNullableFilter<"SearchProfile"> | number | null
    areaWeight?: IntFilter<"SearchProfile"> | number
    districts?: StringFilter<"SearchProfile"> | string
    districtWeight?: IntFilter<"SearchProfile"> | number
    petsRequired?: BoolFilter<"SearchProfile"> | boolean
    petsWeight?: IntFilter<"SearchProfile"> | number
    parkingRequired?: BoolFilter<"SearchProfile"> | boolean
    parkingWeight?: IntFilter<"SearchProfile"> | number
    createdAt?: DateTimeFilter<"SearchProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SearchProfile"> | Date | string
    listings?: ListingListRelationFilter
    runs?: ScrapeRunListRelationFilter
  }

  export type SearchProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    rooms?: SortOrder
    priceMin?: SortOrderInput | SortOrder
    priceMax?: SortOrderInput | SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrderInput | SortOrder
    areaMax?: SortOrderInput | SortOrder
    areaWeight?: SortOrder
    districts?: SortOrder
    districtWeight?: SortOrder
    petsRequired?: SortOrder
    petsWeight?: SortOrder
    parkingRequired?: SortOrder
    parkingWeight?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    listings?: ListingOrderByRelationAggregateInput
    runs?: ScrapeRunOrderByRelationAggregateInput
  }

  export type SearchProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SearchProfileWhereInput | SearchProfileWhereInput[]
    OR?: SearchProfileWhereInput[]
    NOT?: SearchProfileWhereInput | SearchProfileWhereInput[]
    name?: StringFilter<"SearchProfile"> | string
    city?: StringFilter<"SearchProfile"> | string
    rooms?: IntFilter<"SearchProfile"> | number
    priceMin?: IntNullableFilter<"SearchProfile"> | number | null
    priceMax?: IntNullableFilter<"SearchProfile"> | number | null
    priceWeight?: IntFilter<"SearchProfile"> | number
    areaMin?: IntNullableFilter<"SearchProfile"> | number | null
    areaMax?: IntNullableFilter<"SearchProfile"> | number | null
    areaWeight?: IntFilter<"SearchProfile"> | number
    districts?: StringFilter<"SearchProfile"> | string
    districtWeight?: IntFilter<"SearchProfile"> | number
    petsRequired?: BoolFilter<"SearchProfile"> | boolean
    petsWeight?: IntFilter<"SearchProfile"> | number
    parkingRequired?: BoolFilter<"SearchProfile"> | boolean
    parkingWeight?: IntFilter<"SearchProfile"> | number
    createdAt?: DateTimeFilter<"SearchProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SearchProfile"> | Date | string
    listings?: ListingListRelationFilter
    runs?: ScrapeRunListRelationFilter
  }, "id">

  export type SearchProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    rooms?: SortOrder
    priceMin?: SortOrderInput | SortOrder
    priceMax?: SortOrderInput | SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrderInput | SortOrder
    areaMax?: SortOrderInput | SortOrder
    areaWeight?: SortOrder
    districts?: SortOrder
    districtWeight?: SortOrder
    petsRequired?: SortOrder
    petsWeight?: SortOrder
    parkingRequired?: SortOrder
    parkingWeight?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SearchProfileCountOrderByAggregateInput
    _avg?: SearchProfileAvgOrderByAggregateInput
    _max?: SearchProfileMaxOrderByAggregateInput
    _min?: SearchProfileMinOrderByAggregateInput
    _sum?: SearchProfileSumOrderByAggregateInput
  }

  export type SearchProfileScalarWhereWithAggregatesInput = {
    AND?: SearchProfileScalarWhereWithAggregatesInput | SearchProfileScalarWhereWithAggregatesInput[]
    OR?: SearchProfileScalarWhereWithAggregatesInput[]
    NOT?: SearchProfileScalarWhereWithAggregatesInput | SearchProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SearchProfile"> | string
    name?: StringWithAggregatesFilter<"SearchProfile"> | string
    city?: StringWithAggregatesFilter<"SearchProfile"> | string
    rooms?: IntWithAggregatesFilter<"SearchProfile"> | number
    priceMin?: IntNullableWithAggregatesFilter<"SearchProfile"> | number | null
    priceMax?: IntNullableWithAggregatesFilter<"SearchProfile"> | number | null
    priceWeight?: IntWithAggregatesFilter<"SearchProfile"> | number
    areaMin?: IntNullableWithAggregatesFilter<"SearchProfile"> | number | null
    areaMax?: IntNullableWithAggregatesFilter<"SearchProfile"> | number | null
    areaWeight?: IntWithAggregatesFilter<"SearchProfile"> | number
    districts?: StringWithAggregatesFilter<"SearchProfile"> | string
    districtWeight?: IntWithAggregatesFilter<"SearchProfile"> | number
    petsRequired?: BoolWithAggregatesFilter<"SearchProfile"> | boolean
    petsWeight?: IntWithAggregatesFilter<"SearchProfile"> | number
    parkingRequired?: BoolWithAggregatesFilter<"SearchProfile"> | boolean
    parkingWeight?: IntWithAggregatesFilter<"SearchProfile"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SearchProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SearchProfile"> | Date | string
  }

  export type ListingWhereInput = {
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    id?: StringFilter<"Listing"> | string
    source?: StringFilter<"Listing"> | string
    externalId?: StringFilter<"Listing"> | string
    url?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringNullableFilter<"Listing"> | string | null
    price?: IntNullableFilter<"Listing"> | number | null
    rentExtra?: IntNullableFilter<"Listing"> | number | null
    area?: FloatNullableFilter<"Listing"> | number | null
    rooms?: IntNullableFilter<"Listing"> | number | null
    city?: StringNullableFilter<"Listing"> | string | null
    district?: StringNullableFilter<"Listing"> | string | null
    petsAllowed?: BoolNullableFilter<"Listing"> | boolean | null
    hasParking?: BoolNullableFilter<"Listing"> | boolean | null
    imageUrl?: StringNullableFilter<"Listing"> | string | null
    score?: FloatNullableFilter<"Listing"> | number | null
    aiSummary?: StringNullableFilter<"Listing"> | string | null
    aiExtracted?: StringNullableFilter<"Listing"> | string | null
    status?: StringFilter<"Listing"> | string
    rejectReason?: StringNullableFilter<"Listing"> | string | null
    hidden?: BoolFilter<"Listing"> | boolean
    favorite?: BoolFilter<"Listing"> | boolean
    scrapedAt?: DateTimeFilter<"Listing"> | Date | string
    profileId?: StringFilter<"Listing"> | string
    profile?: XOR<SearchProfileScalarRelationFilter, SearchProfileWhereInput>
  }

  export type ListingOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    rentExtra?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    rooms?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    petsAllowed?: SortOrderInput | SortOrder
    hasParking?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    aiExtracted?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectReason?: SortOrderInput | SortOrder
    hidden?: SortOrder
    favorite?: SortOrder
    scrapedAt?: SortOrder
    profileId?: SortOrder
    profile?: SearchProfileOrderByWithRelationInput
  }

  export type ListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    profileId_source_externalId?: ListingProfileIdSourceExternalIdCompoundUniqueInput
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    source?: StringFilter<"Listing"> | string
    externalId?: StringFilter<"Listing"> | string
    url?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringNullableFilter<"Listing"> | string | null
    price?: IntNullableFilter<"Listing"> | number | null
    rentExtra?: IntNullableFilter<"Listing"> | number | null
    area?: FloatNullableFilter<"Listing"> | number | null
    rooms?: IntNullableFilter<"Listing"> | number | null
    city?: StringNullableFilter<"Listing"> | string | null
    district?: StringNullableFilter<"Listing"> | string | null
    petsAllowed?: BoolNullableFilter<"Listing"> | boolean | null
    hasParking?: BoolNullableFilter<"Listing"> | boolean | null
    imageUrl?: StringNullableFilter<"Listing"> | string | null
    score?: FloatNullableFilter<"Listing"> | number | null
    aiSummary?: StringNullableFilter<"Listing"> | string | null
    aiExtracted?: StringNullableFilter<"Listing"> | string | null
    status?: StringFilter<"Listing"> | string
    rejectReason?: StringNullableFilter<"Listing"> | string | null
    hidden?: BoolFilter<"Listing"> | boolean
    favorite?: BoolFilter<"Listing"> | boolean
    scrapedAt?: DateTimeFilter<"Listing"> | Date | string
    profileId?: StringFilter<"Listing"> | string
    profile?: XOR<SearchProfileScalarRelationFilter, SearchProfileWhereInput>
  }, "id" | "profileId_source_externalId">

  export type ListingOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    rentExtra?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    rooms?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    petsAllowed?: SortOrderInput | SortOrder
    hasParking?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    aiExtracted?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectReason?: SortOrderInput | SortOrder
    hidden?: SortOrder
    favorite?: SortOrder
    scrapedAt?: SortOrder
    profileId?: SortOrder
    _count?: ListingCountOrderByAggregateInput
    _avg?: ListingAvgOrderByAggregateInput
    _max?: ListingMaxOrderByAggregateInput
    _min?: ListingMinOrderByAggregateInput
    _sum?: ListingSumOrderByAggregateInput
  }

  export type ListingScalarWhereWithAggregatesInput = {
    AND?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    OR?: ListingScalarWhereWithAggregatesInput[]
    NOT?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Listing"> | string
    source?: StringWithAggregatesFilter<"Listing"> | string
    externalId?: StringWithAggregatesFilter<"Listing"> | string
    url?: StringWithAggregatesFilter<"Listing"> | string
    title?: StringWithAggregatesFilter<"Listing"> | string
    description?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    price?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    rentExtra?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    area?: FloatNullableWithAggregatesFilter<"Listing"> | number | null
    rooms?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    city?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    district?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    petsAllowed?: BoolNullableWithAggregatesFilter<"Listing"> | boolean | null
    hasParking?: BoolNullableWithAggregatesFilter<"Listing"> | boolean | null
    imageUrl?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    score?: FloatNullableWithAggregatesFilter<"Listing"> | number | null
    aiSummary?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    aiExtracted?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    status?: StringWithAggregatesFilter<"Listing"> | string
    rejectReason?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    hidden?: BoolWithAggregatesFilter<"Listing"> | boolean
    favorite?: BoolWithAggregatesFilter<"Listing"> | boolean
    scrapedAt?: DateTimeWithAggregatesFilter<"Listing"> | Date | string
    profileId?: StringWithAggregatesFilter<"Listing"> | string
  }

  export type ScrapeRunWhereInput = {
    AND?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    OR?: ScrapeRunWhereInput[]
    NOT?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    id?: StringFilter<"ScrapeRun"> | string
    profileId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    currentStep?: StringNullableFilter<"ScrapeRun"> | string | null
    statsJson?: StringFilter<"ScrapeRun"> | string
    error?: StringNullableFilter<"ScrapeRun"> | string | null
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
    profile?: XOR<SearchProfileScalarRelationFilter, SearchProfileWhereInput>
  }

  export type ScrapeRunOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrderInput | SortOrder
    statsJson?: SortOrder
    error?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    profile?: SearchProfileOrderByWithRelationInput
  }

  export type ScrapeRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    OR?: ScrapeRunWhereInput[]
    NOT?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    profileId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    currentStep?: StringNullableFilter<"ScrapeRun"> | string | null
    statsJson?: StringFilter<"ScrapeRun"> | string
    error?: StringNullableFilter<"ScrapeRun"> | string | null
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
    profile?: XOR<SearchProfileScalarRelationFilter, SearchProfileWhereInput>
  }, "id">

  export type ScrapeRunOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrderInput | SortOrder
    statsJson?: SortOrder
    error?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    _count?: ScrapeRunCountOrderByAggregateInput
    _max?: ScrapeRunMaxOrderByAggregateInput
    _min?: ScrapeRunMinOrderByAggregateInput
  }

  export type ScrapeRunScalarWhereWithAggregatesInput = {
    AND?: ScrapeRunScalarWhereWithAggregatesInput | ScrapeRunScalarWhereWithAggregatesInput[]
    OR?: ScrapeRunScalarWhereWithAggregatesInput[]
    NOT?: ScrapeRunScalarWhereWithAggregatesInput | ScrapeRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScrapeRun"> | string
    profileId?: StringWithAggregatesFilter<"ScrapeRun"> | string
    status?: StringWithAggregatesFilter<"ScrapeRun"> | string
    currentStep?: StringNullableWithAggregatesFilter<"ScrapeRun"> | string | null
    statsJson?: StringWithAggregatesFilter<"ScrapeRun"> | string
    error?: StringNullableWithAggregatesFilter<"ScrapeRun"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"ScrapeRun"> | Date | string
    finishedAt?: DateTimeNullableWithAggregatesFilter<"ScrapeRun"> | Date | string | null
  }

  export type SearchProfileCreateInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    listings?: ListingCreateNestedManyWithoutProfileInput
    runs?: ScrapeRunCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileUncheckedCreateInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    listings?: ListingUncheckedCreateNestedManyWithoutProfileInput
    runs?: ScrapeRunUncheckedCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: ListingUpdateManyWithoutProfileNestedInput
    runs?: ScrapeRunUpdateManyWithoutProfileNestedInput
  }

  export type SearchProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: ListingUncheckedUpdateManyWithoutProfileNestedInput
    runs?: ScrapeRunUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type SearchProfileCreateManyInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SearchProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingCreateInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
    profile: SearchProfileCreateNestedOneWithoutListingsInput
  }

  export type ListingUncheckedCreateInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
    profileId: string
  }

  export type ListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: SearchProfileUpdateOneRequiredWithoutListingsNestedInput
  }

  export type ListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type ListingCreateManyInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
    profileId: string
  }

  export type ListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type ScrapeRunCreateInput = {
    id?: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
    profile: SearchProfileCreateNestedOneWithoutRunsInput
  }

  export type ScrapeRunUncheckedCreateInput = {
    id?: string
    profileId: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ScrapeRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profile?: SearchProfileUpdateOneRequiredWithoutRunsNestedInput
  }

  export type ScrapeRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunCreateManyInput = {
    id?: string
    profileId: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ScrapeRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ListingListRelationFilter = {
    every?: ListingWhereInput
    some?: ListingWhereInput
    none?: ListingWhereInput
  }

  export type ScrapeRunListRelationFilter = {
    every?: ScrapeRunWhereInput
    some?: ScrapeRunWhereInput
    none?: ScrapeRunWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ListingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScrapeRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SearchProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    rooms?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrder
    areaMax?: SortOrder
    areaWeight?: SortOrder
    districts?: SortOrder
    districtWeight?: SortOrder
    petsRequired?: SortOrder
    petsWeight?: SortOrder
    parkingRequired?: SortOrder
    parkingWeight?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SearchProfileAvgOrderByAggregateInput = {
    rooms?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrder
    areaMax?: SortOrder
    areaWeight?: SortOrder
    districtWeight?: SortOrder
    petsWeight?: SortOrder
    parkingWeight?: SortOrder
  }

  export type SearchProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    rooms?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrder
    areaMax?: SortOrder
    areaWeight?: SortOrder
    districts?: SortOrder
    districtWeight?: SortOrder
    petsRequired?: SortOrder
    petsWeight?: SortOrder
    parkingRequired?: SortOrder
    parkingWeight?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SearchProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    rooms?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrder
    areaMax?: SortOrder
    areaWeight?: SortOrder
    districts?: SortOrder
    districtWeight?: SortOrder
    petsRequired?: SortOrder
    petsWeight?: SortOrder
    parkingRequired?: SortOrder
    parkingWeight?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SearchProfileSumOrderByAggregateInput = {
    rooms?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceWeight?: SortOrder
    areaMin?: SortOrder
    areaMax?: SortOrder
    areaWeight?: SortOrder
    districtWeight?: SortOrder
    petsWeight?: SortOrder
    parkingWeight?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SearchProfileScalarRelationFilter = {
    is?: SearchProfileWhereInput
    isNot?: SearchProfileWhereInput
  }

  export type ListingProfileIdSourceExternalIdCompoundUniqueInput = {
    profileId: string
    source: string
    externalId: string
  }

  export type ListingCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    rentExtra?: SortOrder
    area?: SortOrder
    rooms?: SortOrder
    city?: SortOrder
    district?: SortOrder
    petsAllowed?: SortOrder
    hasParking?: SortOrder
    imageUrl?: SortOrder
    score?: SortOrder
    aiSummary?: SortOrder
    aiExtracted?: SortOrder
    status?: SortOrder
    rejectReason?: SortOrder
    hidden?: SortOrder
    favorite?: SortOrder
    scrapedAt?: SortOrder
    profileId?: SortOrder
  }

  export type ListingAvgOrderByAggregateInput = {
    price?: SortOrder
    rentExtra?: SortOrder
    area?: SortOrder
    rooms?: SortOrder
    score?: SortOrder
  }

  export type ListingMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    rentExtra?: SortOrder
    area?: SortOrder
    rooms?: SortOrder
    city?: SortOrder
    district?: SortOrder
    petsAllowed?: SortOrder
    hasParking?: SortOrder
    imageUrl?: SortOrder
    score?: SortOrder
    aiSummary?: SortOrder
    aiExtracted?: SortOrder
    status?: SortOrder
    rejectReason?: SortOrder
    hidden?: SortOrder
    favorite?: SortOrder
    scrapedAt?: SortOrder
    profileId?: SortOrder
  }

  export type ListingMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    rentExtra?: SortOrder
    area?: SortOrder
    rooms?: SortOrder
    city?: SortOrder
    district?: SortOrder
    petsAllowed?: SortOrder
    hasParking?: SortOrder
    imageUrl?: SortOrder
    score?: SortOrder
    aiSummary?: SortOrder
    aiExtracted?: SortOrder
    status?: SortOrder
    rejectReason?: SortOrder
    hidden?: SortOrder
    favorite?: SortOrder
    scrapedAt?: SortOrder
    profileId?: SortOrder
  }

  export type ListingSumOrderByAggregateInput = {
    price?: SortOrder
    rentExtra?: SortOrder
    area?: SortOrder
    rooms?: SortOrder
    score?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ScrapeRunCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    statsJson?: SortOrder
    error?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type ScrapeRunMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    statsJson?: SortOrder
    error?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type ScrapeRunMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    currentStep?: SortOrder
    statsJson?: SortOrder
    error?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ListingCreateNestedManyWithoutProfileInput = {
    create?: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput> | ListingCreateWithoutProfileInput[] | ListingUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutProfileInput | ListingCreateOrConnectWithoutProfileInput[]
    createMany?: ListingCreateManyProfileInputEnvelope
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type ScrapeRunCreateNestedManyWithoutProfileInput = {
    create?: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput> | ScrapeRunCreateWithoutProfileInput[] | ScrapeRunUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutProfileInput | ScrapeRunCreateOrConnectWithoutProfileInput[]
    createMany?: ScrapeRunCreateManyProfileInputEnvelope
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
  }

  export type ListingUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput> | ListingCreateWithoutProfileInput[] | ListingUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutProfileInput | ListingCreateOrConnectWithoutProfileInput[]
    createMany?: ListingCreateManyProfileInputEnvelope
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type ScrapeRunUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput> | ScrapeRunCreateWithoutProfileInput[] | ScrapeRunUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutProfileInput | ScrapeRunCreateOrConnectWithoutProfileInput[]
    createMany?: ScrapeRunCreateManyProfileInputEnvelope
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ListingUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput> | ListingCreateWithoutProfileInput[] | ListingUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutProfileInput | ListingCreateOrConnectWithoutProfileInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutProfileInput | ListingUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ListingCreateManyProfileInputEnvelope
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutProfileInput | ListingUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutProfileInput | ListingUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type ScrapeRunUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput> | ScrapeRunCreateWithoutProfileInput[] | ScrapeRunUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutProfileInput | ScrapeRunCreateOrConnectWithoutProfileInput[]
    upsert?: ScrapeRunUpsertWithWhereUniqueWithoutProfileInput | ScrapeRunUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ScrapeRunCreateManyProfileInputEnvelope
    set?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    disconnect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    delete?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    update?: ScrapeRunUpdateWithWhereUniqueWithoutProfileInput | ScrapeRunUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ScrapeRunUpdateManyWithWhereWithoutProfileInput | ScrapeRunUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
  }

  export type ListingUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput> | ListingCreateWithoutProfileInput[] | ListingUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutProfileInput | ListingCreateOrConnectWithoutProfileInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutProfileInput | ListingUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ListingCreateManyProfileInputEnvelope
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutProfileInput | ListingUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutProfileInput | ListingUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type ScrapeRunUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput> | ScrapeRunCreateWithoutProfileInput[] | ScrapeRunUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutProfileInput | ScrapeRunCreateOrConnectWithoutProfileInput[]
    upsert?: ScrapeRunUpsertWithWhereUniqueWithoutProfileInput | ScrapeRunUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ScrapeRunCreateManyProfileInputEnvelope
    set?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    disconnect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    delete?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    update?: ScrapeRunUpdateWithWhereUniqueWithoutProfileInput | ScrapeRunUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ScrapeRunUpdateManyWithWhereWithoutProfileInput | ScrapeRunUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
  }

  export type SearchProfileCreateNestedOneWithoutListingsInput = {
    create?: XOR<SearchProfileCreateWithoutListingsInput, SearchProfileUncheckedCreateWithoutListingsInput>
    connectOrCreate?: SearchProfileCreateOrConnectWithoutListingsInput
    connect?: SearchProfileWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type SearchProfileUpdateOneRequiredWithoutListingsNestedInput = {
    create?: XOR<SearchProfileCreateWithoutListingsInput, SearchProfileUncheckedCreateWithoutListingsInput>
    connectOrCreate?: SearchProfileCreateOrConnectWithoutListingsInput
    upsert?: SearchProfileUpsertWithoutListingsInput
    connect?: SearchProfileWhereUniqueInput
    update?: XOR<XOR<SearchProfileUpdateToOneWithWhereWithoutListingsInput, SearchProfileUpdateWithoutListingsInput>, SearchProfileUncheckedUpdateWithoutListingsInput>
  }

  export type SearchProfileCreateNestedOneWithoutRunsInput = {
    create?: XOR<SearchProfileCreateWithoutRunsInput, SearchProfileUncheckedCreateWithoutRunsInput>
    connectOrCreate?: SearchProfileCreateOrConnectWithoutRunsInput
    connect?: SearchProfileWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SearchProfileUpdateOneRequiredWithoutRunsNestedInput = {
    create?: XOR<SearchProfileCreateWithoutRunsInput, SearchProfileUncheckedCreateWithoutRunsInput>
    connectOrCreate?: SearchProfileCreateOrConnectWithoutRunsInput
    upsert?: SearchProfileUpsertWithoutRunsInput
    connect?: SearchProfileWhereUniqueInput
    update?: XOR<XOR<SearchProfileUpdateToOneWithWhereWithoutRunsInput, SearchProfileUpdateWithoutRunsInput>, SearchProfileUncheckedUpdateWithoutRunsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ListingCreateWithoutProfileInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
  }

  export type ListingUncheckedCreateWithoutProfileInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
  }

  export type ListingCreateOrConnectWithoutProfileInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput>
  }

  export type ListingCreateManyProfileInputEnvelope = {
    data: ListingCreateManyProfileInput | ListingCreateManyProfileInput[]
  }

  export type ScrapeRunCreateWithoutProfileInput = {
    id?: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ScrapeRunUncheckedCreateWithoutProfileInput = {
    id?: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ScrapeRunCreateOrConnectWithoutProfileInput = {
    where: ScrapeRunWhereUniqueInput
    create: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput>
  }

  export type ScrapeRunCreateManyProfileInputEnvelope = {
    data: ScrapeRunCreateManyProfileInput | ScrapeRunCreateManyProfileInput[]
  }

  export type ListingUpsertWithWhereUniqueWithoutProfileInput = {
    where: ListingWhereUniqueInput
    update: XOR<ListingUpdateWithoutProfileInput, ListingUncheckedUpdateWithoutProfileInput>
    create: XOR<ListingCreateWithoutProfileInput, ListingUncheckedCreateWithoutProfileInput>
  }

  export type ListingUpdateWithWhereUniqueWithoutProfileInput = {
    where: ListingWhereUniqueInput
    data: XOR<ListingUpdateWithoutProfileInput, ListingUncheckedUpdateWithoutProfileInput>
  }

  export type ListingUpdateManyWithWhereWithoutProfileInput = {
    where: ListingScalarWhereInput
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyWithoutProfileInput>
  }

  export type ListingScalarWhereInput = {
    AND?: ListingScalarWhereInput | ListingScalarWhereInput[]
    OR?: ListingScalarWhereInput[]
    NOT?: ListingScalarWhereInput | ListingScalarWhereInput[]
    id?: StringFilter<"Listing"> | string
    source?: StringFilter<"Listing"> | string
    externalId?: StringFilter<"Listing"> | string
    url?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringNullableFilter<"Listing"> | string | null
    price?: IntNullableFilter<"Listing"> | number | null
    rentExtra?: IntNullableFilter<"Listing"> | number | null
    area?: FloatNullableFilter<"Listing"> | number | null
    rooms?: IntNullableFilter<"Listing"> | number | null
    city?: StringNullableFilter<"Listing"> | string | null
    district?: StringNullableFilter<"Listing"> | string | null
    petsAllowed?: BoolNullableFilter<"Listing"> | boolean | null
    hasParking?: BoolNullableFilter<"Listing"> | boolean | null
    imageUrl?: StringNullableFilter<"Listing"> | string | null
    score?: FloatNullableFilter<"Listing"> | number | null
    aiSummary?: StringNullableFilter<"Listing"> | string | null
    aiExtracted?: StringNullableFilter<"Listing"> | string | null
    status?: StringFilter<"Listing"> | string
    rejectReason?: StringNullableFilter<"Listing"> | string | null
    hidden?: BoolFilter<"Listing"> | boolean
    favorite?: BoolFilter<"Listing"> | boolean
    scrapedAt?: DateTimeFilter<"Listing"> | Date | string
    profileId?: StringFilter<"Listing"> | string
  }

  export type ScrapeRunUpsertWithWhereUniqueWithoutProfileInput = {
    where: ScrapeRunWhereUniqueInput
    update: XOR<ScrapeRunUpdateWithoutProfileInput, ScrapeRunUncheckedUpdateWithoutProfileInput>
    create: XOR<ScrapeRunCreateWithoutProfileInput, ScrapeRunUncheckedCreateWithoutProfileInput>
  }

  export type ScrapeRunUpdateWithWhereUniqueWithoutProfileInput = {
    where: ScrapeRunWhereUniqueInput
    data: XOR<ScrapeRunUpdateWithoutProfileInput, ScrapeRunUncheckedUpdateWithoutProfileInput>
  }

  export type ScrapeRunUpdateManyWithWhereWithoutProfileInput = {
    where: ScrapeRunScalarWhereInput
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyWithoutProfileInput>
  }

  export type ScrapeRunScalarWhereInput = {
    AND?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
    OR?: ScrapeRunScalarWhereInput[]
    NOT?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
    id?: StringFilter<"ScrapeRun"> | string
    profileId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    currentStep?: StringNullableFilter<"ScrapeRun"> | string | null
    statsJson?: StringFilter<"ScrapeRun"> | string
    error?: StringNullableFilter<"ScrapeRun"> | string | null
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
  }

  export type SearchProfileCreateWithoutListingsInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: ScrapeRunCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileUncheckedCreateWithoutListingsInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: ScrapeRunUncheckedCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileCreateOrConnectWithoutListingsInput = {
    where: SearchProfileWhereUniqueInput
    create: XOR<SearchProfileCreateWithoutListingsInput, SearchProfileUncheckedCreateWithoutListingsInput>
  }

  export type SearchProfileUpsertWithoutListingsInput = {
    update: XOR<SearchProfileUpdateWithoutListingsInput, SearchProfileUncheckedUpdateWithoutListingsInput>
    create: XOR<SearchProfileCreateWithoutListingsInput, SearchProfileUncheckedCreateWithoutListingsInput>
    where?: SearchProfileWhereInput
  }

  export type SearchProfileUpdateToOneWithWhereWithoutListingsInput = {
    where?: SearchProfileWhereInput
    data: XOR<SearchProfileUpdateWithoutListingsInput, SearchProfileUncheckedUpdateWithoutListingsInput>
  }

  export type SearchProfileUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: ScrapeRunUpdateManyWithoutProfileNestedInput
  }

  export type SearchProfileUncheckedUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: ScrapeRunUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type SearchProfileCreateWithoutRunsInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    listings?: ListingCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileUncheckedCreateWithoutRunsInput = {
    id?: string
    name: string
    city: string
    rooms: number
    priceMin?: number | null
    priceMax?: number | null
    priceWeight?: number
    areaMin?: number | null
    areaMax?: number | null
    areaWeight?: number
    districts?: string
    districtWeight?: number
    petsRequired?: boolean
    petsWeight?: number
    parkingRequired?: boolean
    parkingWeight?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    listings?: ListingUncheckedCreateNestedManyWithoutProfileInput
  }

  export type SearchProfileCreateOrConnectWithoutRunsInput = {
    where: SearchProfileWhereUniqueInput
    create: XOR<SearchProfileCreateWithoutRunsInput, SearchProfileUncheckedCreateWithoutRunsInput>
  }

  export type SearchProfileUpsertWithoutRunsInput = {
    update: XOR<SearchProfileUpdateWithoutRunsInput, SearchProfileUncheckedUpdateWithoutRunsInput>
    create: XOR<SearchProfileCreateWithoutRunsInput, SearchProfileUncheckedCreateWithoutRunsInput>
    where?: SearchProfileWhereInput
  }

  export type SearchProfileUpdateToOneWithWhereWithoutRunsInput = {
    where?: SearchProfileWhereInput
    data: XOR<SearchProfileUpdateWithoutRunsInput, SearchProfileUncheckedUpdateWithoutRunsInput>
  }

  export type SearchProfileUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: ListingUpdateManyWithoutProfileNestedInput
  }

  export type SearchProfileUncheckedUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    rooms?: IntFieldUpdateOperationsInput | number
    priceMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceMax?: NullableIntFieldUpdateOperationsInput | number | null
    priceWeight?: IntFieldUpdateOperationsInput | number
    areaMin?: NullableIntFieldUpdateOperationsInput | number | null
    areaMax?: NullableIntFieldUpdateOperationsInput | number | null
    areaWeight?: IntFieldUpdateOperationsInput | number
    districts?: StringFieldUpdateOperationsInput | string
    districtWeight?: IntFieldUpdateOperationsInput | number
    petsRequired?: BoolFieldUpdateOperationsInput | boolean
    petsWeight?: IntFieldUpdateOperationsInput | number
    parkingRequired?: BoolFieldUpdateOperationsInput | boolean
    parkingWeight?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: ListingUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ListingCreateManyProfileInput = {
    id?: string
    source: string
    externalId: string
    url: string
    title: string
    description?: string | null
    price?: number | null
    rentExtra?: number | null
    area?: number | null
    rooms?: number | null
    city?: string | null
    district?: string | null
    petsAllowed?: boolean | null
    hasParking?: boolean | null
    imageUrl?: string | null
    score?: number | null
    aiSummary?: string | null
    aiExtracted?: string | null
    status?: string
    rejectReason?: string | null
    hidden?: boolean
    favorite?: boolean
    scrapedAt?: Date | string
  }

  export type ScrapeRunCreateManyProfileInput = {
    id?: string
    status?: string
    currentStep?: string | null
    statsJson?: string
    error?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type ListingUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableIntFieldUpdateOperationsInput | number | null
    rentExtra?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    rooms?: NullableIntFieldUpdateOperationsInput | number | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    petsAllowed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    hasParking?: NullableBoolFieldUpdateOperationsInput | boolean | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiExtracted?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    rejectReason?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    favorite?: BoolFieldUpdateOperationsInput | boolean
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeRunUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    statsJson?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}