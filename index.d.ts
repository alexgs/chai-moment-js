/// <reference types="chai" />

declare global {

    export namespace Chai {

        interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
            after:Assertion;
            before:Assertion;
            sameOrAfter:Assertion;
            sameOrBefore:Assertion;
            betweenMoments( start:any, end:any, specificity?:string, inclusivity?:string ):Assertion;
            moment( timestamp:any, specificity?:string ):Assertion;
        }
    }
}

declare function chaiMoment( chai: any, utils: any ): void;
declare namespace chaiMoment { }
export = chaiMoment;
