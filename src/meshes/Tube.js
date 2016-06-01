WHS.Tube = class Tube extends WHS.Shape {

  /**
   * Creates a tube
   *
   * @param {Object} params - Tube options
   * @param {Object} params.geometry - Tube geometry options
   * @param {Number} params.geometry.path - Tube path
   * @param {Number} params.geometry.segments - Tube segments
   * @param {Number} params.geometry.radius - Tube radius
   * @param {Number} params.geometry.radiusSegments - Amount of radius segments
   * @param {Boolean} params.geometry.closed - Whether or not the tube is closed
   * @param {Material} params.material - Tube material
   * @param {Number} params.mass - Tube mass
   */
  constructor(params = {}) {

    super(params, 'tube');

    WHS.API.extend(params.geometry, {

      path: options.geometryOptions.path ? new this.CustomSinCurve(100) : false,
      segments: 20,
      radius: 2,
      radiusSegments: 8,
      closed: false

    });

    this.build(params);

    super.wrap();

  }

  build(params = {}) {

    const _scope = this,
      mesh = this.physics ? Physijs.ConvexMesh : THREE.Mesh,
      material = super._initMaterial(params.material);

    return new Promise((resolve, reject) => {

      _scope.setNative(new mesh(
        new THREE.TubeGeometry(

          params.geometry.path,
          params.geometry.segments,
          params.geometry.radius,
          params.geometry.radiusSegments,
          params.geometry.closed

        ),

        material,
        params.mass
      ));

      resolve();

    });

  }

  get CustomSinCurve() {

    return THREE.Curve.create(

      (scale) => { // custom curve constructor

        this.scale = scale || 1;

      },

      (t) => { // getPoint: t is between 0-1

        const tx = t * 3 - 1.5,
          ty = Math.sin(2 * Math.PI * t),
          tz = 0;

        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

      }

    );

  }

  /**
   * Clone tube.
   */
  clone() {

    return new WHS.Tube(this.getParams(), this._type).copy(this);

  }

};