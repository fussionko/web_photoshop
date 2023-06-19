'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};                                                                                                                                                                                                                                  Events                                                                                                                                                                                                                �  ��  @ >  P  
        �       �S     � �       �!      � D   �?     ��     �S      6 ��   !      ; �   !     6 ? �  �!      @ �   !      D �    !      H ��   !      M ��   !      R ��   !     6 W   �!      X   �!     �Y @  �!     � a     �S     
 ! @   !     @ %      �     ` e �   �S     ` � �   �S     ` % �   �S      � �   �?  �db�name�body�definer�execute_at�interval_value�interval_field�created�modified�last_executed�starts�ends�status�on_completion�sql_mode�comment�originator�time_zone�character_set_client�collation_connection�db_collation�body_utf8� �YEAR�QUARTER�MONTH�DAY�HOUR�MINUTE�WEEK�SECOND�MICROSECOND�YEAR_MONTH�DAY_HOUR�DAY_MINUTE�DAY_SECOND�HOUR_MINUTE�HOUR_SECOND�MINUTE_SECOND�DAY_MICROSECOND�HOUR_MICROSECOND�MINUTE_MICROSECOND�SECOND_MICROSECOND� �ENABLED�DISABLED�SLAVESIDE_DISABLED� �DROP�PRESERVE� �REAL_AS_FLOAT�PIPES_AS_CONCAT�ANSI_QUOTES�IGNORE_SPACE�IGNORE_BAD_TABLE_OPTIONS�ONLY_FULL_GROUP_BY�NO_UNSIGNED_SUBTRACTION�NO_DIR_IN_CREATE�POSTGRESQL�ORACLE�MSSQL�DB2�MAXDB�NO_KEY_OPTIONS�NO_TABLE_OPTIONS�NO_FIELD_OPTIONS�MYSQL323�MYSQL40�ANSI�NO_AUTO_VALUE_ON_ZERO�NO_BACKSLASH_ESCAPES�STRICT_TRANS_TABLES�STRICT_ALL_TABLES�NO_ZERO_IN_DATE�NO_ZERO_DATE�INVALID_DATES�ERROR_FOR_DIVISION_BY_ZERO�TRADITIONAL�NO_AUTO_CREATE_USER�HIGH_NOT_PRECEDENCE�NO_ENGINE_SUBSTITUTION�PAD_CHAR_TO_FULL_LENGTH�EMPTY_STRING_IS_NULL�SIMULTANEOUS_ASSIGNMENT�TIME_ROUND_FRACTIONAL�                                                                                                                                                                                                                                                                                                                                                                                           |flf{f�fqfyfjfrfgi�hi�h*i�h�h�hi�h�h�h�h�hii�h�hi�hipi�hi�h�hi�h�h�h�h�hi
ii�h�h�h�h�h�h�hi�h�hi%i�h9k;k?k<k�k�k�k�k�k�k�k�k0l�mFnGnnIn�n<n=nEnbn+n?nAn]nsnn3nKn@nQn;nn.n^n                                                                                                                                  hn\nan1n(n`nqnkn9n"n0nSnen'nxndnwnUnynRnfn5n6nZn qq/q�p.q1q#q%q"q2qq(q:qqKrZr�r�r�r�r�rss0s"s1s3s's2s-s&s#s5ss.t,t0t+tt                                                                    t!t-t1t$t#tt)t t2t�t/uoulu�u�u�u�u�u�u�u�u�v�v�vFwGwDwMwEwJwNwKwLw�w�w`xdxex\xmxqxjxnxpxixhx^xbxtysyrypyz
zzzz�z�z�zJ{;{D{H{L{N{@{X{E{�|�|�|�|X}o}c}S}V}g}j}O}m}\}k}R}T}i}Q}_}N}>?e                                                                                                                                  f����Q�O�P���ԀC�J�R�O�G�=�M�:����������<�=�?�u�;�σ��#������������ƃȃ�ヿ��݃�؃���˃΃փ��Ƀ	��ރ���                                                                    Ճ��ǃу��Ã��ă��׃��ۃ��؆��ӆ�چ�݆�܆��׆�цH�V�U���׈�������������������Ɉ������݉ډۉN�M�9�Y�@�W�X�D�E�R�H�Q�J�L�O�_���������������������؍Ӎ͍Ǎ֍܍ύՍٍȍ׍ō�����                                                                                                                                  ����������������-�4�/��,������������ ����a�d�_�b�`��
�%���&��� ��������'���$�����{���������~���                                                                    ������ȖÖ��l�p�n���������N�N�N�P�P�P�P�P�P�P�P�P�P�P�P�P�P�P�P�P�QzRxR{R|R�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�U�UWSXhXdXOXMXIXoXUXNX]XYXeX[X=XcXqX�X�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z                                                                                                                                  �Z�Z�Z�Z�Z�Z�Z�Z�[�[�[\3\q]c]J]e]r]l]^]h]g]b]�]O^N^J^M^K^�^�^�^�^�^@_�_�_�`IaJa+aEa6a2a.aFa/aOa)a@a bh�#b%b$b�c�c�cdd	d d$d                                                                    3dCdddd9d7d"d#dd&d0d(dAd5d/d
dd@d%d'dd�cd.d!ddoe�e�e�f�f�f�f�f�f�f�fxf gfi_i8iNibiqi?iEiji9iBiWiYiziHiIi5ili3i=iei�hxi4iii@ioiDiviXiAitiLi;iKi7i\iOiQi2iRi/i{i<iFkEkCkBkHkAk�k��k�k                                                                                                                                  �k�k�k�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�n�nGqTqRqcq`qAq]qbqrqxqjqaqBqXqCqKqpq_qPqSq                                                                    DqMqZqOr�r�r�r�r�r<sBs;s:s@sJsIsDtJtKtRtQtWt@tOtPtNtBtFtMtTt�t�t�t�tuyuwu�i�uvv�u�u�u�u�uv�u�u�u�u�u�v�v�vUw_w`wRwVwZwiwgwTwYwmw�w�x�x�x�x�x�x�x�x�x�xyx�x�x�x{x|y�y}yyyzzzzzz"zz                                                                                                                                  zz�z�z�z�zf{d{m{t{i{r{e{s{q{p{a{x{v{c{�|�|�|�}�}�}�}}�}z}�}{}�}|}�}�}�}}}�}mkghl�����!�d�`�w�\�i�[�b�r�!g^�v�g�o�                                                                    D�a��I�D�@�B�E��?�V�v�y�����e�Q�@���g�0�M�}�Z�Y�t�s�]��^�7�:�4�z�C�x�2�E�)�كK�/�B�-�_�p�9�N�L�R�o�ń��;�G�6�3�h�~�D�+�`�T�n�P��������ֆ��M����	������ֈˈ͈Έވۈڈ̈Ј����߉��                                                                                                                                  ����܉�v����a�?�w�����u�����t�z�<�K�J�e�d�f�������̌h�i��������������������������Ѝ����������� ������R�?�                                                                    D�I�=���������n�o�H�R�0�:�f�3�e�^���.�J�F�m�l�O�`�g�o�6�a�p�1�T�c�P�r�N�S�L�V�2�����������������Ζ��������s�w�x�r����������������������[���眀����P�P�P�P�P�P�P�P�P�P�P�P�P�P�P                                                                                                                                  �Q�R�R�R�R0S�S'VVVV�UVVVVV�UVV�U�U�X|X�X�X�X�XXtX�XzX�X�X�XvX�X�X{X�X�X�XkY�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Z�Zw[�[                                                                    �[c\�]�]}]�]z]�]w]�]�]�]~]|]�]y]]X^Y^S^�^�^�^�^�^�^�^�^�^D_C_o_�_,a(aAa^aqasaRaSarala�ataTaza[aea;ajaaaVa)b'b+b+dMd[d]dtdvdrdsd}dudfd�dNd�d^d\dKdSd`dPdd?dldkdYdedwdse�e�f�f�fgg"g�i�i�i                                                                                                                                  �i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�i�iJkMkKk�k�k�k�k�k�k�n�n�no%o�n7o�n.o	oNooo'oo;oo�n
o                                                                    6oso�n�n-o@o0o<o5o�nooCoo�n�n9oo�n:ooooo!o�q�q�q�q�q�q�q{q�q�q�qDrSr�r�r�rCsMsQsLsbtstqtutrtgtnt uuu}u�uvvvvv
vv�v�w|w�w�wnw�wow~w�w�x�x�x�x�x~x�x�x�x�x�x�x�x�y�y�y�y�y�y�y                                                                                                                                  �y�y�y�y+zJz0z/z(z&z�z�z�z�z�{�{�{�{�{�{�{�{�{�{�{�{�R�{�{�{�|�|�|�|�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}�}s����                                                                    $�]�\��������������������������΄������������̈́������Є����������Ǆ̄��������ք����τ��ׄԄ҄ۄ����a�3�#�(�k�@�.��!���C�,�A�>�F� �2�*�-�<��:�1�5�B�&�'�8�$��0������������������                                                                                                                                  ���눝���������艫�����������=�h�i�Ռό׌��	�������
������� ������#�� �"����$�!��z�r�y�s�����v���z���������                                                                    ������y�������������}���������������~���������-�������X�}�z�~�������{������Η͗������ ������Ù��������Ǚ����>�?�`�a�_��������PQ0Q�PQQ�P�PQQ�P
Q�R�R�R�RHVBVLV5VAVJVIVFVXV                                                                                                                                  ZV@V3V=V,V>V8V*V:VW�X�X�X�X�X�X�X�X�X�X�Z�Z�Z�Z�Z[�Z[�Z[[[[g\�]�]�]�]�]�]�]�]�]�]�]�]i^]^`^\^�}�^�^�^I_�_�a�aya�a�a�a�a                                                                    �a�a�a�a�a�a�a�a�afa�a-bndpd�d�d�d�d�d�d�d�d�d�d�dhd�d�dvezeye{e�e�e�f�f�f�f�f�f�f jjj�i�ij�i�i j�i�i�ijj�i'j�i�ij�i�i@jj�i�ij�i�i	jjj%jj�i&jj�ijQk�k�k�k�kl l�klAo&o~o�o�o�o                                                                                                                                  �o�o�oboOo�oZo�ovolo�oUoroRoPoWo�o�o]o oaoko}ogo�oSo�oioo�ocowojo{o�q�q�q�q�q�q�q�q�q�q�q�q�q�q�q�q�q�r�rXsRs^s_s`s]s[sasZsYs                                                                    bs�t�t�t�t�t}t�t�t|tytuu~u%vvvvv#vv(vv�v�v�v�v�w�w�w�w�x�x�x�x�x�x�x�x�x�x�x�y�y�y�y�y�yvk9z�z�z�z�{�{�{�{�{�{�{�{�{�|�|�|�|�}�}�}�}�}�}~�}�}�}�}�}�}�}v���������d�g�����                                                                                                                                  �����������O�S�R�P�N�Q�$�;�� �)��	���
�'����+������*���������������(��.�������1�&��������� �0���/�b�                                                                    V�c�d�w��s�X�T�[�R�a�Z�Q�^�m�j�P�N�_�]�o�l�z�n�\�e�O�{�u�b�g�i�Z������������	�����������ϊƊ��ӊъԊՊ��׊����Ŋ؊Ê����ي>�M����ߌٌ�ڌ݌猠������� �#�%�$�.������&�'�                                                                                                                                  �������,�$��� �#���s�p�o�g�k�/�+�)�*�2�&�.���������������ВÒĒ��ْ��ϒ�ߒؒ�גݒ̒��ʒȒΒ�͒Ւɒ��ޒ�ђӒ                                                                    ���ƒ��|�������������Ӗ���Z�������Зϗ��&�)�(� ��'�����������ܙ͙ϙәԙΙəؙ֙˙י̙�������F�C�g�t�q�f�v�u�p�h�d�l������������ ����������Ӟ��QQQQQ�Q4S�SpV`VnV                                                                                                                                  sVfVcVmVrV^VwVWW�X�X�X�X�X�X�X�X[[[![[[[[([[ [[�[�]�]�]�]�]�]�]�]�]�]�]�]�]g^h^f^o^�^�^�^�^�^K_�_�a�a�a�a�a�a�a�a�a                                  4]*-1 + img_data[i+2+4+canvas_width*4]*-1;
        new_img_data[i] = r_sum;
        new_img_data[i+1] = g_sum;
        new_img_data[i+2] = b_sum;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function unsharpening(img_data, amount, kernel_size)
{
    let new_img_data = [];
    let blurred = gaussian_blur(img_data, kernel_size);
    for(let i = 0; i < img_data.length; i+=4)
    {
        new_img_data[i] = img_data[i] + (img_data[i]-blurred[i])*amount;
        new_img_data[i+1] = img_data[i+1] + (img_data[i+1]-blurred[i+1])*amount;
        new_img_data[i+2] = img_data[i+2] + (img_data[i+2]-blurred[i+2])*amount;
        new_img_data[i+3] = img_data[i+3];
    }
   
    return new_img_data;
}

function box_filter(data_m)
{
    let sum = 0;
    for(let i = 0; i < data_m.length; i++)
        for(let j = 0; j < data_m.length; j++)
            sum += data_m[i][j];
    return sum*(1/9);
}

const weighted_avg_linear_matrix = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

const weighted_avg_linear_matrix2 = [
    [1, 4, 1],
    [4, 20, 4],
    [1, 4, 123]
];

function weighted_avg_linear(img_data, weight)
{
    let new_img_data = [];
    let weighted_avg_linear_matrix_test = [
        [1, 2, 1],
        [2, 4*weight, 2],
        [1, 2, 1]
    ];
    weight *= 2;
    for(let i = 0; i < img_data.length; i+=4)
    {
        let values_matrix_r = [
            [img_data[i-4-canvas_width*4], img_data[i-canvas_width*4], img_data[i+4-canvas_width*4]],
            [img_data[i-4], img_data[i], img_data[i+4]],
            [img_data[i-4+canvas_width*4], img_data[i+canvas_width*4], img_data[i+4+canvas_width*4]]
        ];

        let values_matrix_g = [
            [img_data[i+1-4-canvas_width*4], img_data[i+1-canvas_width*4], img_data[i+1+4-canvas_width*4]],
            [img_data[i+1-4], img_data[i+1], img_data[i+1+4]],
            [img_data[i+1-4+canvas_width*4], img_data[i+1+canvas_width*4], img_data[i+1+4+canvas_width*4]]
        ];

        let values_matrix_b = [
            [img_data[i+2-4-canvas_width*4], img_data[i+2-canvas_width*4], img_data[i+2+4-canvas_width*4]],
            [img_data[i+2-4], img_data[i+2], img_data[i+2+4]],
            [img_data[i+2-4+canvas_width*4], img_data[i+2+canvas_width*4], img_data[i+2+4+canvas_width*4]]
        ];

        let mat_r = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_r)*(1/weight);
        let mat_g = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_g)*(1/weight);
        let mat_b = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_b)*(1/weight);

        new_img_data[i] = mat_r;
        new_img_data[i+1] = mat_g;
        new_img_data[i+2] = mat_b;
        new_img_data[i+3] = img_data[i+3];
    }

    return new_img_data;
}

// function decrease_quality(img_data)
// {
//     let new_img_data = [];
//     for(let i = 0; i < img_data.length; i+=4)
//     {
//         new_img_data[i] = (canvas_width*4)%i ? 
//         ;
//         new_img_data[i+3] = img_data[i];
//     }
//     return new_img_data;
// }


// let basket_num = 10;
// let basket_size = Math.round(255/basket_num);
// const graph_template = {
//     "r":{},
//     "g":{},
//     "b":{}
// }
// let graph = JSON.parse(JSON.stringify(graph_template));
// create_graph();
// function create_graph()
// {
//     graph = JSON.parse(JSON.stringify(graph_template));
//     for(let i = 0; i < basket_num; i++)
//     {
//         graph["r"][basket_size*i] = 0;
//         graph["g"][basket_size*i] = 0;
//         graph["b"][basket_size*i] = 0;
//     }
// }

// function count_graph()
// {
//     let num = 0;
//     for(const color in graph)
//     {
//         let keys = Object.keys(graph[color]);
//         for(keys)
//     }
//     return num;
// }
// function count_Pixel(img_data)
// {
//     console.log("IZVEDENO", img_data);
//     let ranges = Object.keys(graph["r"]);
//     for(let i = 0; i < img_data.length; i+=4)
//     {
//         for(const key in ranges)
//             if(img_data[i] < ranges[key]) 
//             {
//                 graph["r"][ranges[key]]++;
//                 break;
//             }
//         for(const key in ranges)
//             if(img_data[i+1] < ranges[key]) 
//             {
//                 graph["g"][ranges[key]]++;
//                 break;
//             }
//         for(const key in ranges)
//             if(img_data[i+2] < ranges[key]) 
//             {
//                 graph["b"][ranges[key]]++;
//                 break;
//             }
//     }
//     console.log(count_graph());
// }

let ultra_computed_gaussian_blur = {};

function gaussian_blur(img_data, deviation)
{
    if(deviation === 0) return img_data;
    if(ultra_computed_gaussian_blur[deviation] !== undefined) return ultra_computed_gaussian_blur[deviation];

    let new_img_data = [];
    const range = 2*deviation;
    let matrix_gaussian = [], sum = get_gaussian_matrix(range, deviation, matrix_gaussian);
    for(let i = 0; i < img_data.length; i+=4)
    {
        let matrix_r_adjecant = [], matrix_g_adjecant = [], matrix_b_adjecant = []; 
        get_adjecant_pixels(i, range, img_data, matrix_r_adjecant, matrix_g_adjecant, matrix_b_adjecant);
        new_img_data[i] = calculateMatrixSum(matrix_gaussian, matrix_r_adjecant)/sum;
        new_img_data[i+1] = calculateMatrixSum(matrix_gaussian, matrix_g_adjecant)/sum;
        new_img_data[i+2] = calculateMatrixSum(matrix_gaussian, matrix_b_adjecant)/sum;
        new_img_data[i+3] = img_data[i+3];
    }
    ultra_computed_gaussian_blur[deviation] = new_img_data;

    return new_img_data;
}

function get_adjecant_pixels(index, range, img_data, matrix_r_adjecant, matrix_g_adjecant, matrix_b_adjecant)
{
    let next = canvas_width*4;
    for(let y = -range; y <= range; y++)
    {
        let yrange = y+range;
        matrix_r_adjecant[yrange] = [];
        matrix_g_adjecant[yrange] = [];
        matrix_b_adjecant[yrange] = [];  
        for(let x = -range; x <= range; x++)
        {
            let xrange = x+range;
            let r = 128, g = 128, b = 128;
            if(index%(canvas_width*4)+x*4 >= 0)
            {
                const main_i = index+next*y+4*x;
                if(main_i >= 0)
                {
                    r = img_data[main_i];
                    g = img_data[main_i+1];
                    b = img_data[main_i+2];
                }
            }
            matrix_r_adjecant[yrange][xrange] = r;
            matrix_g_adjecant[yrange][xrange] = g;
            matrix_b_adjecant[yrange][xrange] = b;
        }
    } 
}

function get_adjecant_pixels_array(index, range, img_data, array_r_adjecant, array_g_adjecant, array_b_adjecant)
{
    const next = canvas_width*4;
    for(let y = -range; y <= range; y++)
    {
        for(let x = -range; x <= range; x++)
        {
            let r = 0, g = 0, b = 0;
            if(index%(canvas_width*4)+x*4 >= 0)
            {
                const main_i = index+next*y+4*x;
                if(main_i >= 0)
                {
                    r = img_data[main_i];
                    g = img_data[main_i+1];
                    b = img_data[main_i+2];
                }
            }
            array_r_adjecant.push(r);
            array_g_adjecant.push(g);
            array_b_adjecant.push(b);
        }
    } 
}

function get_gaussian_matrix(range, deviation, matrix_gaussian)
{
    let sum = 0;
    for(let y = -range; y <= range; y++)
    {
        matrix_gaussian[y+range] = [];
        for(let x = -range; x <= range; x++)
        {
            matrix_gaussian[y+range][x+range] = gaussian_2d_equation(x, y, deviation);
            sum += matrix_gaussian[y+range][x+range];
        }
    }
    return sum;
}

function gaussian_2d_equation(x, y, deviation)
{
    let exp = -(x*x+y*y)/(2*deviation*deviation);
    let main = 1/(2*Math.PI*deviation*deviation);
    return main*Math.pow(Math.E, exp);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function calculateMatrixSum(matrix, values)
{
    let sum = 0;
    for(let i = 0; i < matrix[0].length; i++)
        for(let j = 0; j < matrix.length; j++)
            if(values[i][j] !== undefined)
                sum += values[i][j]*matrix[i][j];        
    return sum;
}

function loadImage(img_data)
{
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(img_data);
    main_ctx.putImageData(draw_image, 0, 0);
    count_Pixel(draw_image["data"]);
}

function load_buttons(parent, controls)
{
    let original = document.createElement("div");
    original.class = "button-function";
    original.innerText = "Original";
    original.addEventListener("click", function(){
        clear(controls);
        loadImage(original_img_data);
    });
    parent.appendChild(original);

    let grayscale_avg = document.createElement("div");
    grayscale_avg.class = "button-function";
    grayscale_avg.innerText = "Grayscale - average";
    grayscale_avg.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_average(original_img_data));
    });
    parent.appendChild(grayscale_avg);

    let grayscale_w = document.createElement("div");
    grayscale_w.class = "button-function";
    grayscale_w.innerText = "Grayscale - weight";
    grayscale_w.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_weight(original_img_data));
    });
    parent.appendChild(grayscale_w);


    let threshold = document.createElement("div");
    threshold.class = "button-function";
    threshold.innerText = "Thresholding";
    threshold.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "thresholding-control-slider", 0, 255, 1, 128);
        createInput(controls, "thresholding-min-value", 0, 255, 1, 0);
        createInput(controls, "thresholding-max-value", 0, 255, 1, 255);

        document.getElementById("thresholding-control-slider").addEventListener("input", function(){
            loadImage(thresholding(original_img_data, parseInt(document.getElementById("thresholding-min-value").value), 
                                                        parseInt(document.getElementById("thresholding-max-value").value), parseInt(this.value)));
        });
        
        document.getElementById("thresholding-min-value").addEventListener("change", function(){
            loadImage(thresholding(original_img_data, parseInt(this.value), parseInt(document.getElementById("thresholding-max-value").value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });

        document.getElementById("thresholding-max-value").addEventListener("change", function(){
            loadImage(thresholding(original_img_data, parseInt(document.getElementById("thresholding-min-value").value), parseInt(this.value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });
    });
    parent.appendChild(threshold);

    let channel_remove = document.createElement("div");
    channel_remove.class = "button-function";
    channel_remove.innerText = "Remove color channel";
    channel_remove.addEventListener("click", function(){
        clear(controls);
        createCheckbox(controls, "color-channel-remove-red", 1);
        createCheckbox(controls, "color-channel-remove-green", 1);
        createCheckbox(controls, "color-channel-remove-blue", 1);

        let checkboxes = document.getElementsByTagName("input");
        for(let i = 0; i < checkboxes.length; i++)
            checkboxes[i].addEventListener("change", () => {
                loadImage(color_channel_remove(original_img_data, document.getElementById("color-channel-remove-red").checked, 
                                                                    document.getElementById("color-channel-remove-green").checked, 
                                                                    document.getElementById("color-channel-remove-blue").checked));
            });

    });
    parent.appendChild(channel_remove);

    let channel_change = document.createElement("div");
    channel_change.class = "button-function";
    channel_change.innerText = "Change color channel";
    channel_change.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "color-channel-change-red", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-green", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-blue", -255, 255, 1, 0);
        let sliders = document.getElementsByTagName("input");
        for(let i = 0; i < sliders .length; i++)
        sliders [i].addEventListener("input", () => {
            loadImage(color_channel_change(original_img_data, parseInt(document.getElementById("color-channel-change-red").value), 
                                                                parseInt(document.getElementById("color-channel-change-green").value), 
                                                                parseInt(document.getElementById("color-channel-change-blue").value)));
        });
    });
    parent.appendChild(channel_change);

    let brightness = document.createElement("div");
    brightness.class = "button-function";
    brightness.id = "brightness";
    brightness.innerText = "Change brightness";
    brightness.addEventListener("click", function(){
        clear(controls);
        createSlider(controls,"brightness-control-slider", -255, 255, 1, 0);
        document.getElementById("brightness-control-slider").addEventListener("input", function(){
            loadImage(brighten_image(original_img_data, parseInt(this.value)));
        });      
    });
    parent.appendChild(brightness);

    let sob = document.createElement("div");
    sob.class = "button-function";
    sob.innerText = "Sobel";
    sob.addEventListener("click", function(){
        clear(controls);
        createRadio(controls, "type", "sobel-controls-all", "all");
        createRadio(controls, "type", "sobel-controls-x", "x");
        createRadio(controls, "type", "sobel-controls-y", "y");
        // createInput(controls, "sobel-controls-min", 0, 255, 1, 0);
        // createInput(controls, "sobel-controls-max", 0, 255, 1, 255);
        createCheckbox(controls, "sobel-controls-color-ok", 0);
        createColor(controls, "sobel-controls-min-color", "#ffffff");
        createColor(controls, "sobel-controls-max-color", "#000000");
        createSlider(controls, "sobel-controls-threshold", 0, 255, 1, 128);
        //document.querySelector('input[name="genderS"]:checked').value;
        document.getElementById("sobel-controls-all").addEventListener("click", function(){
            loadImage(sobel(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-x").addEventListener("click", function(){
            loadImage(sobel_x(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-y").addEventListener("click", function(){
            loadImage(sobel_y(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value)));  
        });

        document.getElementById("sobel-controls-min-color").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-max-color").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-threshold").addEventListener("input", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-color-ok").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });
         
    });
    parent.appendChild(sob);
    
    let sharp = document.createElement("div");
    sharp.class = "button-function";
    sharp.innerText = "Sharpening";
    sharp.addEventListener("click", function(){
        clear(controls);
        loadImage(sharpening(original_img_data));  
    });
    parent.appendChild(sharp);

    let unsharp = document.createElement("div");
    unsharp.class = "button-function";
    unsharp.innerText = "Unsharpening";
    unsharp.addEventListener("click", function(){
        clear(controls);   
        createSlider(controls, "unsharp-amount-controls", -15, 15, 0.1, 1);
        createSlider(controls, "unsharp-kernel-controls", 1, 8, 1, 1);
        loadImage(unsharpening(original_img_data, 1, 1));
        document.getElementById("unsharp-amount-controls").addEventListener("input", function(){
            loadImage(unsharpening(original_img_data, parseFloat(this.value), parseInt(document.getElementById("unsharp-kernel-controls").value)));  
        });
        document.getElementById("unsharp-kernel-controls").addEventListener("change", function(){
            loadImage(unsharpening(original_img_data, parseFloat(document.getElementById("unsharp-amount-controls").value), parseInt(this.value)));  
        });
    });
    parent.appendChild(unsharp);

    let weight_avg_lin = document.createElement("div");
    weight_avg_lin.class = "button-function";
    weight_avg_lin.id = "weighted_avg_linear";
    weight_avg_lin.innerText = "Weighted average linear";
    weight_avg_lin.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "weighted_avg_linear-controls-weight", 1, 255, 1, 1);
        document.getElementById("weighted_avg_linear-controls-weight").addEventListener("input", function(){
            loadImage(weighted_avg_linear(original_img_data, parseInt(this.value)));  
        });
        loadImage(weighted_avg_linear(original_img_data, 1));  
        
    });
    parent.appendChild(weight_avg_lin);

    let gaussian_dev = document.createElement("div");
    gaussian_dev.class = "button-function";
    gaussian_dev.innerText = "Gaussian deviation";
    gaussian_dev.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gaussian-deviation-controls-deviation",0, max_gaussian, 1, 0);
        document.getElementById("gaussian-deviation-controls-deviation").addEventListener("change", function(){
            console.log(parseFloat(this.value));
            loadImage(gaussian_blur(original_img_data, parseFloat(this.value)));
        });
        
    });
    parent.appendChild(gaussian_dev);

    let mod = document.createElement("div");
    mod.class = "button-function";
    mod.innerText = "Modulus glajenje";
    mod.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "modulus-controls", 0, max_modulus, 1, 0);
        document.getElementById("modulus-controls").addEventListener("change", function(){
            loadImage(modulus(original_img_data, parseInt(this.value)));
        });
        
    });
    parent.appendChild(mod);

    let gam = document.createElement("div");
    gam.class = "button-function";
    gam.innerText = "Gamma korekcija";
    gam.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gamma-controls", 0.01, 20, 0.01, 1);
        document.getElementById("gamma-controls").addEventListener("input", function(){
            loadImage(gamma(original_img_data, parseFloat(this.value)));
        });
    });
    parent.appendChild(gam);
    
}

function sobel_change()
{
    if(document.querySelector('input[name="type"]:checked') === null) return 0;
    let check = document.querySelector('input[name="type"]:checked').value;
    if(check == "all")
        loadImage(sobel(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "x")
        loadImage(sobel_x(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "y")
        loadImage(sobel_y(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    return 1;
}

function clear(parent)
{
    while (parent.firstChild)
        parent.removeChild(parent.firstChild);
}

function createSlider(parent, id, min, max, step, value)
{
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.id = id;
    slider.name = id;
    parent.appendChild(slider);
}

function createInput(parent, id, min, max, step, value)
{
    let input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    input.id = id;
    input.name = id;
    parent.appendChild(input);
}

function createCheckbox(parent, id, value)
{
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.id = id;
    checkbox.name = id;
    checkbox.checked = value;
    parent.appendChild(checkbox);
}

function createRadio(parent, name, id, value)
{
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.value = value;
    radio.id = id;
    radio.name = name;
    parent.appendChild(radio);
}

function createColor(parent, id, value)
{
    let radio = document.createElement("input");
    radio.type = "color";
    radio.value = value;
    radio.id = id;
    radio.name = id;
    parent.appendChild(radio);
}
