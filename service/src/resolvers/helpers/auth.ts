/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError } from '../../utils/errors'
import { AdminAuthenticationError } from '../../utils/errors'

type InferArgs<T> = T extends (...t: [...infer Arg]) => any ? Arg : never
type InferReturn<T> = T extends (...t: [...infer Arg]) => infer Res
    ? Res
    : never

const admin = <TFunc extends (...args: any[]) => any>(
    func: TFunc,
): ((...args: InferArgs<TFunc>) => InferReturn<TFunc>) => {
    return (...args: InferArgs<TFunc>) => {
        if (!args[2].user) throw new AuthenticationError()
        if (!args[2].user.admin) throw new AdminAuthenticationError()

        return func(...args)
    }
}

const user = <TFunc extends (...args: any[]) => any>(
    func: TFunc,
): ((...args: InferArgs<TFunc>) => InferReturn<TFunc>) => {
    return (...args: InferArgs<TFunc>) => {
        if (!args[2].user) throw new AuthenticationError()

        return func(...args)
    }
}

export { admin, user }
