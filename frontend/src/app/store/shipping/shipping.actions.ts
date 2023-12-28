
export namespace ShippingActions {
    export class RetrieveShippingMethods {
        static readonly type = '[ShippingActions] Retrieve Shipping Methods';
    }
    export class RetrieveShippingClasses {
        static readonly type = '[ShippingActions] Retrieve Shipping Classes';
    }
    export class RetrievePaymentGateways {
        static readonly type = '[ShippingActions] Retrieve Payment Gateways';
    }
    export class RetrieveShippingZones {
        static readonly type = '[ShippingActions] Retrieve Shipping Zones';
    }
    export class RetrieveTaxesClasses {
        static readonly type = '[ShippingActions] Retrieve Taxes Classes';
    }
    export class UpdateCartShippingLines {
        static readonly type = '[ShippingActions] Update Cart Shipping Lines';
        constructor(public selectedShippingLine: any) { }
    }
    export class UpdateCartPaymentGateways {
        static readonly type = '[ShippingActions] Update Cart Payment Gateways';
        constructor(public paymentGateway: any) { }
    }
    export class SetShippingMethods {
        static readonly type = '[ShippingActions] Set Shipping Methods';
        constructor(public selectedZone: any) { }
    }
    export class GetShippingDetails {
        static readonly type = '[ShippingActions] Get Shipping Details';
        constructor(public methodId: string, public zoneID: string) { }
    }
    export class ClearShippingDetails {
        static readonly type = '[ShippingActions] ClearShippingDetails';
    }
}