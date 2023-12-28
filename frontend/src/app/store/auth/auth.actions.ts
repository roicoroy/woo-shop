import { CreateNonce, LoginPayload, RegisterPayload, RegisterWpUserPayload, RetrievePasswordPayload } from "src/app/shared/wooApi";
import { Customer } from "src/app/shared/blogApi/utils/types/wooCommerceTypes";

export namespace AuthActions {
    export class CreateNonceAction {
        static readonly type = '[AuthActions] Create Nonce Action';
        constructor(public payload: CreateNonce) { }
    }
    export class Login {
        static readonly type = '[AuthActions] Login';
        constructor(public loginPayload: LoginPayload) { }
    }
    export class Register {
        static readonly type = '[AuthActions] Register';
        constructor(public customer: Customer) { }
    }
    export class RetrievePassword {
        static readonly type = '[AuthActions] Retrieve Password';
        constructor(public payload: RetrievePasswordPayload) { }
    }
    export class GetAuthToken {
        static readonly type = '[AuthActions] Get Auth Token';
        constructor(public loginPayload: LoginPayload) { }
    }
    export class RefresUserState {
        static readonly type = '[AuthActions] Refresh User State';
    }
    export class GenerateAuthCookie {
        static readonly type = '[AuthActions] Generate Auth Cookie';
        constructor(public loginPayload: LoginPayload) { }
    }
    export class AuthLogout {
        static readonly type = '[AuthActions] AuthLogout';
    }
}