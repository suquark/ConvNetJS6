import get_optimizer from 'optimizer/index.js';  // the default function
import { getopt } from 'util.js'

class Layer {
    constructor(layer_type, opt={}) {
        this.name = opt.name;
        // computed
        this.out_sx = opt.in_sx;
        this.out_sy = opt.in_sy;
        this.out_depth = opt.in_depth;
        this.layer_type = layer_type;

        this.serialize = opt.serialize || [];
        this.updated = [];
    }

    getParamsAndGrads() { return []; }

    _pack_vars(vol, allow_regl=true) {
        return {
            params: vol.w, 
            grads: vol.dw,
            l1_decay_mul: allow_regl ? this.l1_decay_mul : 0., 
            l2_decay_mul: allow_regl ? this.l2_decay_mul : 0.,
            optimizer: vol.optimizer 
        };
    }

    compile(options) {
        // setup optimizers
        this.updated.forEach(function(V) {
            V.optimizer = get_optimizer(V.size, options);
            V.dw = V.zeros_like();
        });
    }
    
    forward(V, is_training) {
        /*
            this.in_act = V;
            this.out_act = f(V);
            return this.out_act;
        */
        this.in_act = V;
        this.out_act = V; // nothing to do, output raw scores
        return V;
    }

    backward() { 
        /*
            this.in_act.grad = f(V, this.out_act);
            this.grad = g(this.w, this.out_act);
        */
    }

    toJSON() {
        var json = {};
        json.out_depth = this.out_depth;
        json.out_sx = this.out_sx;
        json.out_sy = this.out_sy;
        json.layer_type = this.layer_type;
        this.serialize.forEach(key => json[key] = this[key])
        return json;
    }

    fromJSON(json) {
        this.out_depth = json.out_depth;
        this.out_sx = json.out_sx;
        this.out_sy = json.out_sy;
        this.layer_type = json.layer_type;
        this.serialize.forEach(key => this[key] = json[key])
    }

    get out_size() {
        return this.out_sx * this.out_sy * this.out_depth;
    }

    createOutput() {
        return new Array(this.out_sx*this.out_sy*this.out_depth).fill(0.);
    }
}

class InputLayer extends Layer {
    constructor(opt) { 
        super('input', opt);
         // required: depth
        this.out_depth = getopt(opt, ['out_depth', 'depth'], 0);

        // optional: default these dimensions to 1
        this.out_sx = getopt(opt, ['out_sx', 'sx', 'width'], 1);
        this.out_sy = getopt(opt, ['out_sy', 'sy', 'height'], 1);
    }
}

export {Layer, OutputLayer, InputLayer};
