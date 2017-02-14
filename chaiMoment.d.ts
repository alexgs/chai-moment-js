/// <reference types="chai" />

declare global {

    export namespace Chai {

        interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
            moment( timestamp: any, specificity?: string );
        }
    }
}

declare function chaiMoment( chai: any, utils: any ): void;
declare namespace chaiMoment { }
export = chaiMoment;
