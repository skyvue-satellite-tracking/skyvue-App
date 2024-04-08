function int(a) {
    return a < 0 ? Math.ceil(a) : Math.floor(a);
}

function jdn(Y, M, D) {
    return int((1461 * (Y + 4800 + int((M - 14) / 12))) / 4) + int((367 * (M - 2 - 12 * int((M - 14) / 12))) / 12) - int((3 * int(((Y + 4900 + int((M - 14) / 12)) / 100)) / 4)) + D - 32075;
}

function eccentric_anomaly(e, M) {
    function f(E) {
        return E - e * Math.sin(E) - M;
    }

    function fp(E) {
        return 1 - e * Math.cos(E);
    }

    var E = M;
    var oldE;
    for (var i = 0; i < 20; i++) {
        oldE = E;
        E = E - f(E) / fp(E);
        if (Math.abs(oldE - E) < 0.00000001)
            break;
    }

    return E;
}

function true_anomaly(e, E) {
    return 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
}



function GLDrawer(scale, ready_callback) {

    var canvas3D = document.createElement("canvas");
    canvas3D.id = 'canvas3D';
    var gl = canvas3D.getContext('experimental-webgl');

    var asset_names = ["land", "clouds", "lights"];
    var mip_levels = 2;

    var assets = [];
    var textures = [];
    var loaded_assets_count = 0;

    var vert_scale = 1.1;
    var vertices = [-vert_scale, +vert_scale, -vert_scale, -vert_scale, +vert_scale, -vert_scale, +vert_scale, +vert_scale, ];

    indices = [3, 2, 1, 3, 1, 0];

    for (var j = 0; j < asset_names.length; j++) {
        textures[j] = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, textures[j]);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var pixel = new Uint8Array([2, 5, 20, 255]);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            pixel);
    }

    function asset_loaded() {
        loaded_assets_count++;

        if (loaded_assets_count == mip_levels * asset_names.length) {
            for (var j = 0; j < asset_names.length; j++) {
                gl.bindTexture(gl.TEXTURE_2D, textures[j]);
                for (var i = 0; i < mip_levels; i++) {
                    gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, assets[j][i]);
                }
            }

            ready_callback();
        }
    }

    for (var j = 0; j < asset_names.length; j++) {
        assets[j] = [];

        var name = asset_names[j];

        for (var i = 0; i < mip_levels; i++) {
            var image = new Image();
            assets[j].push(image);
            image.src = "./components/Interface/ViewPanel/components/Map3DTab/map3D/images/earth_sun/" + name + i + ".jpg";
            image.onload = asset_loaded;
        }
    }

    var vertex_buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    var earth_vert_src =
        `
    attribute vec2 coordinates;
    uniform mat2 ctm;
    uniform vec2 tr;
    varying highp vec2 unit;
    void main(void) {
        unit = coordinates;
        gl_Position = vec4(coordinates * ctm + tr, 0.0, 1.0);
    }
    `;

    var earth_frag_src =
        `
        precision highp float;
        varying highp vec2 unit;
        
        uniform sampler2D ground_tex;
        uniform sampler2D clouds_tex;
        uniform sampler2D lights_tex;

        uniform mat3 rot;
        uniform vec3 sun_dir;
        uniform float aa;
        uniform float sun_scale;
        uniform float point_scale;

        void main(void) {
            vec2 u = unit;

            float d_sq = u.x*u.x + u.y*u.y;
            float d = sqrt(d_sq);

            vec3 xyz = vec3(u.x, u.y, sqrt(max(0.0, 1.0 - d_sq)));
            vec3 ss_xyz = xyz;

            xyz *= rot;

            vec2 ll = vec2(atan(xyz.z, xyz.x), asin(xyz.y));

            vec2 coord = vec2(1.0 - (ll.x * 0.5 /3.1415926536 + 0.5), 1.0 - (ll.y  / 3.1415926536 + 0.5));

            float sun_dot = sqrt(max(0.0, dot(ss_xyz, sun_dir)));
            float mul = mix(1.0, sun_dot, sun_scale);

            mediump vec4 color = texture2D(ground_tex, coord);
            mediump float clouds_a = texture2D(clouds_tex, coord).r * 0.9;
            mediump float lights_a = texture2D(lights_tex, coord).r;

            lights_a *= (1.0 - mul) * (1.0 - mul) * 0.7;

            color.rgb *= mul;
            color.rgb *= 1.0 - lights_a;
            color.rgb += vec3(lights_a, lights_a*0.95, lights_a*0.8);

            color.rgb *= 1.0 - clouds_a;
            color.rgb += vec3(clouds_a * mul);


            mediump float rim_a = (1.0 - ss_xyz.z);
            rim_a = rim_a * rim_a;
            rim_a = rim_a * rim_a;
            rim_a = rim_a * rim_a;
            rim_a *= smoothstep(0.0, 0.4, sun_dot);
            color.rgb *= 1.0 - rim_a;
            color.rgb += vec3(0.5, 0.6, 0.8) * rim_a;

            mediump float dot_a = point_scale * smoothstep (0.99991, 0.99995, dot(ss_xyz, sun_dir));
            
            color.rgb *= 1.0 - dot_a;
            color.rgb += dot_a * vec3(1.0, 0.15, 0.15);
  
            gl_FragColor = color * (1.0 - smoothstep (1.0 - aa, 1.0 + aa, d));
        }
        `;

    var earth_shader = new Shader(gl,
        earth_vert_src,
        earth_frag_src, ["coordinates"], ["ctm", "tr", "rot", "sun_dir", "sun_scale", "point_scale", "aa", "ground_tex", "clouds_tex", "lights_tex"]);


    var outline_vert_src =
        `
    attribute vec2 coordinates;
    uniform mat2 ctm;
    uniform vec2 tr;
    varying vec2 unit;
    void main(void) {
        unit = coordinates * vec2(3.14159265359, 3.14159265359 * 0.5);
        gl_Position = vec4(coordinates * ctm + tr, 0.0, 1.0);
    }
    `;

    var outline_frag_src =
        `
        precision highp float;
        varying highp vec2 unit;
        
        uniform vec3 sun_dir;

        void main(void) {
            vec2 u = unit;

            vec3 xyz = vec3 (sin(u.x)*cos(u.y), sin(u.y), cos(u.x)*cos(u.y));

            float mul = mix(1.0, sqrt(max(0.0, dot(xyz, sun_dir))), 0.75);
            float dot_a = 0.8 * smoothstep (0.9996, 0.99995, dot(xyz, sun_dir));

            mediump vec4 color = vec4(0, 0, 0,1.0 - mul);
            
            color *= 1.0 - dot_a;
            color += dot_a * vec4(1.0, 0.15, 0.15, 1.0);

            gl_FragColor = color;
        }
        `;

    var ndc_sx, ndc_sy;

    this.begin = function(width, height) {
        canvas3D.width = width * scale;
        canvas3D.height = height * scale;

        ndc_sx = 2 / width;
        ndc_sy = 2 / height;

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas3D.width, canvas3D.height);
    }

    this.draw_earth = function(center, radius, rotation, sun_dir, sun_scale, point_scale) {
        gl.useProgram(earth_shader.shader);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, textures[2]);

        var ctm = [radius * ndc_sx, 0, 0, radius * ndc_sy];
        var tr = [center[0] * ndc_sx - 1, center[1] * ndc_sy - 1];
        var aa = 1 / (vert_scale * radius * scale);

        var rot = mat3_mul([0, 0, 1, 0, 1, 0, -1, 0, 0], rotation);

        if (sun_scale === undefined)
            sun_scale = 0;

        if (sun_dir === undefined)
            sun_dir = [1, 0, 0];

        if (point_scale === undefined)
            point_scale = 0;

        gl.uniformMatrix2fv(earth_shader.uniforms["ctm"], false, ctm);
        gl.uniform2fv(earth_shader.uniforms["tr"], tr);
        gl.uniformMatrix3fv(earth_shader.uniforms["rot"], false, rot);
        gl.uniform3fv(earth_shader.uniforms["sun_dir"], sun_dir);
        gl.uniform1f(earth_shader.uniforms["sun_scale"], sun_scale);
        gl.uniform1f(earth_shader.uniforms["point_scale"], point_scale);
        gl.uniform1f(earth_shader.uniforms["aa"], aa);

        gl.uniform1i(earth_shader.uniforms["ground_tex"], 0);
        gl.uniform1i(earth_shader.uniforms["clouds_tex"], 1);
        gl.uniform1i(earth_shader.uniforms["lights_tex"], 2);

        gl.enableVertexAttribArray(earth_shader.attributes["coordinates"]);
        gl.vertexAttribPointer(earth_shader.attributes["coordinates"], 2, gl.FLOAT, false, 0, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    this.draw_outline = function(size, sun_dir) {
        gl.useProgram(outline_shader.shader);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

        var ctm = [size[0] * ndc_sx / 2, 0, 0, size[1] * ndc_sy / 2];

        gl.uniformMatrix2fv(outline_shader.uniforms["ctm"], false, ctm);
        gl.uniform3fv(outline_shader.uniforms["sun_dir"], sun_dir);

        gl.vertexAttribPointer(outline_shader.attributes["coordinates"], 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(outline_shader.attributes["coordinates"]);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    this.finish = function() {
        return gl.canvas;
    }
}

function SpaceDrawer(gl, scale, container, mode) {

    var wrapper = document.createElement("div");
    wrapper.classList.add("canvas_container");

    var canvas3D;

    let year = 2019,
        month = 1,
        day = 1,
        hour = 1,
        minute = 1;
    var L_p, R_p, fake_L_p, fake_R_p;
    var e = 0.0167086;
    var fake_e = 0.4;

    var omega_p = 0;


    var date_string;
    var time_string;

    // relative to perihelium
    var earth_angle_at_start = -Math.PI / 2 - 0.039605960630149865 - 12.05 / 23.9344696 * Math.PI * 2;
    var earth_rot = 0;
    var progress = 0.5;

    // calculated from var year = 2019, month = 09, day = 23, hour = 07, minute = 50;
    var precession_angle = -0.22769915391360662;

    this.set_date = function(y, m, d) {
        year = y;
        month = m;
        day = d;

        this.recalc();
        this.repaint();
    }

    this.set_time = function(hh, mm) {
        hour = hh;
        minute = mm;

        this.recalc();
        this.repaint();
    }

    this.set_progress = function(x) {
        progress = x;
        this.repaint();
    }

    this.recalc = function() {

        var mi = minute;
        var h = hour;
        var d = day;
        var m = month;
        var y = year;

        var l = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (h == 24) {
            h = 0;
            d++
        }

        if (l[m - 1] < d) {
            d -= l[m - 1];
            m++;
        }

        if (m == 13) {
            m = 1;
            y++;
        }


        var de = jdn(y, m, d);
        de += (h - 12) / 24 + mi / 1440;

        // solar azimuth at perihelion

        earth_rot = (de - (jdn(2019, 1, 3) + -7 / 24 + 19 / 1440)) * Math.PI * 2 * 24 / 23.9344696 +
            (-101 + 18 / 60 + 40 / 3600) * Math.PI / 180; // latitude of 180 azimuth
        de -= 2451545;

        var M = 6.24004077 + 0.01720197 * de;
        var dt = -7.659 * Math.sin(M) + 9.863 * Math.sin(2 * M + 3.5932);

        // earth_rot += dt * 2 * Math.PI /(24*60);

        omega_p = 102.937683 * Math.PI / 180; // - Math.PI * 2 * de/(25772 * 365.2425);

        var Tp = 1.000017;
        var eps_p = 100.464572 * Math.PI / 180;
        var mean_anomaly = Math.PI * 2 * de / (365.242191 * Tp) + eps_p - omega_p;

        var E_p = eccentric_anomaly(e, mean_anomaly);
        var ni_p = true_anomaly(e, E_p);
        L_p = ni_p;
        R_p = (1 - e * e) / (1 + e * Math.cos(ni_p));

        earth_rot -= ni_p;

        var fake_E_p = eccentric_anomaly(fake_e, mean_anomaly);
        var fake_ni_p = true_anomaly(fake_e, fake_E_p);
        fake_L_p = fake_ni_p;
        fake_R_p = (1 - fake_e * fake_e) / (1 + fake_e * Math.cos(fake_ni_p));

        function pad(num) {
            return (num.toString().length) == 1 ? "0" + num : num.toString();
        }

        date_string = !metric ? pad(m) + "/" + pad(d) + "/" + y :
            pad(d) + "/" + pad(m) + "/" + y;


        time_string = !metric ? pad((h + 11) % 12 + 1) + ":" + pad(mi) + " " + (h < 12 || hour == 24 ? "AM" : "PM") :
            pad(h) + ":" + pad(mi);

        time_string += " UTC"


    }

    this.recalc();
    var mvp = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var arcball;

    canvas3D = document.createElement("canvas");
    canvas3D.style.position = "absolute";
    canvas3D.style.top = "0";
    canvas3D.style.left = "0";

    wrapper.appendChild(canvas3D);
    container.appendChild(wrapper);

    arcball = new ArcBall(mvp, function() {
        mvp = arcball.matrix.slice();
        self.repaint();
    });

    arg = 0;
    this.set_arg = function(x) { arg = x;
        paint(); 
    }

    var width, height;

    var max_tilt = 300;
    var drag_y = max_tilt * 0.6;


    if (mode == "plane") {
        new Dragger(canvas3D, function(x, y) {
            drag_y = Math.max(0, Math.min(max_tilt, drag_y - y));
            self.repaint();
        })
    }

    function canvas_space(e) {
        var r = canvas3D.getBoundingClientRect();
        return [width - (e.clientX - r.left), (e.clientY - r.top)];
    }


    if (arcball) {
        new TouchHandler(canvas3D,

            function(e) {

                var p = canvas_space(e);
                arcball.start(p[0], p[1]);

                return true;
            },
            function(e) {
                var p = canvas_space(e);
                arcball.update(p[0], p[1], e.timeStamp);
                mvp = arcball.matrix.slice();

                self.repaint();

                return true;
            },
            function(e) {
                arcball.end(e.timeStamp);
            });
    }


    var ecliptic_angle = 23.4392811 * Math.PI / 180;
    var sin = Math.sin(ecliptic_angle);
    var cos = Math.cos(ecliptic_angle);

    var top_down = mat3_mul([1, 0, 0, 0, 0, 1, 0, -1, 0], [cos, 0, -sin, 0, 1, 0, sin, 0, cos]);
    var psin = Math.sin(precession_angle);
    var pcos = Math.cos(precession_angle);

    top_down = mat3_mul(top_down, [pcos, psin, 0, -psin, pcos, 0, 0, 0, 1]);

    this.repaint = function() {

        var ctx = canvas3D.getContext("2d");

        ctx.resetTransform();
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.clearRect(0, 0, canvas3D.width, canvas3D.height);
        ctx.scale(scale, scale);

        function earth_sunlight(point) {

            var size = Math.max(0, Math.min(width, height -30));

            ctx.translate(width / 2, height / 2);

            var sun_dir = [0, 0, 1];
            var sun_to_ecliptic = L_p + omega_p;

            var mat = mat3_invert(mvp);

            var line_mat = mat3_mul([1, 0, 0, 0, -1, 0, 0, 0, 1], mvp);
            var p0 = mat3_mul_vec(line_mat, [0, size / 2 + 3, 0]);
            var p1 = mat3_mul_vec(line_mat, [0, size / 2 + 13, 0]);

            var p2 = mat3_mul_vec(line_mat, [0, -size / 2 - 3, 0]);
            var p3 = mat3_mul_vec(line_mat, [0, -size / 2 - 13, 0]);

            ctx.lineWidth = 2.0;
            ctx.strokeStyle = "#5A617A";
            ctx.lineCap = "round";

            var sun_mat = mvp;

            sun_mat = mat3_mul(sun_mat, rot_y_mat3(-earth_rot));

            sun_mat = mat3_mul(sun_mat, rot_y_mat3(-sun_to_ecliptic));
            sun_mat = mat3_mul(sun_mat, rot_z_mat3(-ecliptic_angle));
            sun_mat = mat3_mul(sun_mat, rot_y_mat3(+sun_to_ecliptic));


            sun_dir = mat3_mul_vec(sun_mat, sun_dir);

            gl.begin(size, size);
            gl.draw_earth([size / 2, size / 2], size / 2, mat, sun_dir, 0.92, point ? 0.9 : 0.0);


            if (p0[2] < 0) {
                ctx.beginPath();
                ctx.moveTo(p0[0], p0[1]);
                ctx.lineTo(p1[0], p1[1]);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(p2[0], p2[1]);
                ctx.lineTo(p3[0], p3[1]);
                ctx.stroke();
            }

            ctx.drawImage(gl.finish(), -size / 2, -size / 2, size, size);

            if (p0[2] >= 0) {
                ctx.beginPath();
                ctx.moveTo(p0[0], p0[1]);
                ctx.lineTo(p1[0], p1[1]);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(p2[0], p2[1]);
                ctx.lineTo(p3[0], p3[1]);
                ctx.stroke();
            }



            // ctx.font = "20px IBM Plex Sans";
            // ctx.textAlign = "right";

            // ctx.fillStyle = "#907567";
            // ctx.fillText(date_string, -6, height / 2 + 10);

            // ctx.textAlign = "left";

            // ctx.fillStyle = "#5A617A";
            // ctx.fillText(time_string, 6, height / 2 + 10);
        };

        earth_sunlight();

    }

    var self = this;
    this.on_resize = function() {

        width = Math.max(wrapper.clientWidth, 400);
        height = Math.max(wrapper.clientHeight, 400);


        canvas3D.style.width = width + "px";
        canvas3D.style.height = height + "px";
        canvas3D.width = width * scale;
        canvas3D.height = height * scale;


        if (arcball) {

            var size = Math.max(0, Math.min(width, height - 30) - 30);
            arcball.set_viewport(15, 15, size, size);
        }

        self.repaint();
    }

    this.on_resize();
    
    window.addEventListener("load", this.on_resize, true);
}


document.addEventListener("DOMContentLoaded", function(event) {
    

    metric = localStorage.getItem("global.metric") === "true";

    var scale = Math.min(2, window.devicePixelRatio || 1);
    var gl = new GLDrawer(scale, function() {});

    var sunlight_drawer = new SpaceDrawer(gl, scale, document.getElementById("es_earth_sunlight"), "earth_sunlight");

    function t_to_date(t) {

        var year = 2019;

        t *= 365;
        var i = 0;
        var l = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        while (t > l[i]) {
            t -= l[i];
            i++;
        }
        t = Math.floor(t);


        return i == 11 && t == 31 ? [year + 1, 1, 1] : [year, i + 1, t + 1];
    }

    function t_to_time(t) {
        t *= 24.0;
        var h = Math.floor(t);
        var m = Math.floor((t - h) * 60);
        return [h, m]
    }

    updateSunlightDirection = function(timeArray) {
        sunlight_drawer.set_date(timeArray[0], timeArray[1], timeArray[2]);
        sunlight_drawer.set_time(timeArray[3], timeArray[4]);
    }

    // new Slider(document.getElementById("es_earth_sunlight_date_slider_container"), function(x) {
    //     var ymd = t_to_date(x);
    //     sunlight_drawer.set_date(ymd[0], ymd[1], ymd[2]);
    // }, undefined);

    // new Slider(document.getElementById("es_earth_sunlight_time_slider_container"), function(x) {
    //     var hm = t_to_time(x);
    //     sunlight_drawer.set_time(hm[0], hm[1]);
    // }, undefined, 0.25);


});

