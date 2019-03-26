import { Injectable, Component, NgModule, defineInjectable } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableService = /** @class */ (function () {
    function NutotableService() {
    }
    NutotableService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NutotableService.ctorParameters = function () { return []; };
    /** @nocollapse */ NutotableService.ngInjectableDef = defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });
    return NutotableService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableComponent = /** @class */ (function () {
    function NutotableComponent() {
    }
    /**
     * @return {?}
     */
    NutotableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NutotableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-nutotable',
                    template: "\n    <p>\n      nutotable works!\n    </p>\n  "
                }] }
    ];
    /** @nocollapse */
    NutotableComponent.ctorParameters = function () { return []; };
    return NutotableComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableModule = /** @class */ (function () {
    function NutotableModule() {
    }
    NutotableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NutotableComponent],
                    imports: [],
                    exports: [NutotableComponent]
                },] }
    ];
    return NutotableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NutotableService, NutotableComponent, NutotableModule };

//# sourceMappingURL=nutotable.js.map