import { ReSubstitute } from "@fdmg/resubstitute";

class isMobileStore extends ReSubstitute {
    private _isMobileSize: boolean = true;

    setIsMobile(isMobile: boolean) {        
        this._isMobileSize = isMobile;
        this.trigger();
    }

    getIsMobile() {
        return this._isMobileSize;
    }
}

export default new isMobileStore();