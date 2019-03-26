(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('nutotable', ['exports', '@angular/core'], factory) :
    (factory((global.nutotable = {}),global.ng.core));
}(this, (function (exports,i0) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NutotableService = /** @class */ (function () {
        function NutotableService() {
        }
        NutotableService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        NutotableService.ctorParameters = function () { return []; };
        /** @nocollapse */ NutotableService.ngInjectableDef = i0.defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });
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
            { type: i0.Component, args: [{
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
            { type: i0.NgModule, args: [{
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

    exports.NutotableService = NutotableService;
    exports.NutotableComponent = NutotableComponent;
    exports.NutotableModule = NutotableModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=nutotable.umd.js.map