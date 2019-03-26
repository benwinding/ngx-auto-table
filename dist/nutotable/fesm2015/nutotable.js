import { Injectable, Component, NgModule, defineInjectable } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableService {
    constructor() { }
}
NutotableService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NutotableService.ctorParameters = () => [];
/** @nocollapse */ NutotableService.ngInjectableDef = defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NutotableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-nutotable',
                template: `
    <p>
      nutotable works!
    </p>
  `
            }] }
];
/** @nocollapse */
NutotableComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableModule {
}
NutotableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NutotableComponent],
                imports: [],
                exports: [NutotableComponent]
            },] }
];

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