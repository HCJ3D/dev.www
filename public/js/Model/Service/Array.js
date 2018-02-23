var Model = Model || {};
Model.Service = Model.Service || {};

Model.Service.Array = class {
    /**
     * Get keys which are in the old array and not in the new one.
     */
    getOldKeys(oldArrayKeys, newArrayKeys) {
        var oldKeys = [];
        for (var i = 0, length = oldArrayKeys.length; i < length; i++) {
            if (!this.inArray(oldArrayKeys[i], newArrayKeys)) {
                oldKeys.push(oldArrayKeys[i]);
            }
        }
        return oldKeys;
    }

    /**
     * Get keys which are in the new array and not in the old one.
     */
    getNewKeys(oldArrayKeys, newArrayKeys) {
        var newKeys = [];
        for (var i = 0, length = newArrayKeys.length; i < length; i++) {
            if (!this.inArray(newArrayKeys[i], oldArrayKeys)) {
                newKeys.push(newArrayKeys[i]);
            }
        }
        return newKeys;
    }

    inArray(needle, haystack) {
        return (haystack.indexOf(needle) >= 0);
    }
}
