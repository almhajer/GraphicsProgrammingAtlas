#!/bin/zsh
set -euo pipefail

mkdir -p assets/pipeline_gifs

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=960x220:d=6:r=16 -filter_complex '
[0:v]
drawbox=x=20:y=78:w=130:h=64:color=0x0f766e@0.95:t=fill,
drawbox=x=175:y=78:w=130:h=64:color=0x0f4c81@0.95:t=fill,
drawbox=x=330:y=78:w=130:h=64:color=0x1d4ed8@0.95:t=fill,
drawbox=x=485:y=78:w=130:h=64:color=0x7c3aed@0.95:t=fill,
drawbox=x=640:y=78:w=130:h=64:color=0xc2410c@0.95:t=fill,
drawbox=x=795:y=78:w=145:h=64:color=0xb42318@0.95:t=fill,
drawbox=x=20:y=150:w=920:h=4:color=0xcbd5e1@1:t=fill,
drawbox=x='"'"'40+145*t'"'"':y=144:w=22:h=16:color=0xfacc15@1:t=fill,
drawbox=x=14:y=72:w=142:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,0,1)'"'"',
drawbox=x=169:y=72:w=142:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,1,2)'"'"',
drawbox=x=324:y=72:w=142:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,2,3)'"'"',
drawbox=x=479:y=72:w=142:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,3,4)'"'"',
drawbox=x=634:y=72:w=142:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,4,5)'"'"',
drawbox=x=789:y=72:w=157:h=76:color=0xfacc15@0.85:t=6:enable='"'"'between(t,5,6)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/pipeline_line.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=18:y=46:w=104:h=96:color=0x083b36@0.18:t=fill,
drawbox=x=30:y=34:w=104:h=96:color=0x0f766e@0.18:t=fill,
drawbox=x=226:y=46:w=110:h=96:color=0x0f2747@0.16:t=fill,
drawbox=x=214:y=34:w=110:h=96:color=0x1d4ed8@0.16:t=fill,
drawbox=x=44:y=74:w=14:h=46:color=0x0f766e@1:t=fill,
drawbox=x=68:y=62:w=14:h=60:color=0x0f766e@1:t=fill,
drawbox=x=92:y=80:w=14:h=30:color=0x0f766e@1:t=fill,
drawbox=x=50:y=80:w=14:h=46:color=0x06312d@0.32:t=fill,
drawbox=x=74:y=68:w=14:h=60:color=0x06312d@0.32:t=fill,
drawbox=x=98:y=86:w=14:h=30:color=0x06312d@0.32:t=fill,
drawbox=x=38:y=58:w=76:h=72:color=0xfacc15@0.58:t=fill:enable='"'"'between(t,0,1.0)'"'"',
drawbox=x=112:y=74:w='"'"'86*min(max(t-0.7,0),1)'"'"':h=7:color=0xfacc15@1:t=fill,
drawbox=x=112:y=96:w='"'"'98*min(max(t-1.0,0),1)'"'"':h=7:color=0x38bdf8@1:t=fill,
drawbox=x=112:y=118:w='"'"'112*min(max(t-1.3,0),1)'"'"':h=7:color=0xf97316@1:t=fill,
drawbox=x=236:y=74:w=30:h=30:color=0x7c3aed@0.26:t=fill:enable='"'"'between(t,1.8,4)'"'"',
drawbox=x=242:y=68:w=30:h=30:color=0xfacc15@1:t=fill:enable='"'"'between(t,1.8,4)'"'"',
drawbox=x=270:y=100:w=30:h=30:color=0x1e3a8a@0.26:t=fill:enable='"'"'between(t,2.0,4)'"'"',
drawbox=x=276:y=94:w=30:h=30:color=0x38bdf8@1:t=fill:enable='"'"'between(t,2.0,4)'"'"',
drawbox=x=300:y=80:w=30:h=30:color=0x7c2d12@0.26:t=fill:enable='"'"'between(t,2.2,4)'"'"',
drawbox=x=306:y=74:w=30:h=30:color=0xf97316@1:t=fill:enable='"'"'between(t,2.2,4)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_vertex_input.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=60:y=44:w=148:h=104:color=0x082b4a@0.16:t=fill,
drawbox=x=72:y=32:w=148:h=104:color=0x0f4c81@0.16:t=fill,
drawbox=x=80:y=58:w=26:h=26:color=0x0f4c81@1:t=fill,
drawbox=x=176:y=54:w=26:h=26:color=0x0f4c81@1:t=fill,
drawbox=x=128:y=118:w=26:h=26:color=0x0f4c81@1:t=fill,
drawbox=x=86:y=64:w=26:h=26:color=0x052538@0.28:t=fill,
drawbox=x=182:y=60:w=26:h=26:color=0x052538@0.28:t=fill,
drawbox=x=134:y=124:w=26:h=26:color=0x052538@0.28:t=fill,
drawbox=x=92:y=70:w='"'"'94*min(max(t-0.5,0),1)'"'"':h=7:color=0xfacc15@1:t=fill,
drawbox=x=138:y='"'"'120-54*min(max(t-1.1,0),1)'"'"':w=7:h='"'"'54*min(max(t-1.1,0),1)'"'"':color=0xfacc15@1:t=fill,
drawbox=x='"'"'144-48*min(max(t-1.8,0),1)'"'"':y='"'"'120-48*min(max(t-1.8,0),1)'"'"':w='"'"'48*min(max(t-1.8,0),1)'"'"':h=7:color=0xfacc15@1:t=fill,
drawbox=x=92:y=58:w=112:h=86:color=0x0f4c81@0.30:t=fill:enable='"'"'between(t,2.3,4)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_input_assembly.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=26:y=48:w=104:h=94:color=0x1e3a8a@0.14:t=fill,
drawbox=x=40:y=34:w=104:h=94:color=0x1d4ed8@0.14:t=fill,
drawbox=x=150:y=62:w=86:h=64:color=0x92400e@0.24:t=fill,
drawbox=x=138:y=50:w=86:h=64:color=0xf59e0b@0.88:t=fill,
drawbox=x=234:y=40:w=94:h=96:color=0x7c2d12@0.18:t=fill,
drawbox=x=222:y=28:w=94:h=96:color=0xf97316@0.16:t=fill,
drawbox=x=60:y=112:w=18:h=18:color=0x1d4ed8@1:t=fill,
drawbox=x=98:y=58:w=18:h=18:color=0x1d4ed8@1:t=fill,
drawbox=x=124:y=114:w=18:h=18:color=0x1d4ed8@1:t=fill,
drawbox=x=136:y=86:w='"'"'46*min(max(t-0.4,0),1)'"'"':h=7:color=0xfacc15@1:t=fill,
drawbox=x=180:y=82:w=16:h=16:color=0xfacc15@1:t=fill:enable='"'"'between(t,1.0,2.2)'"'"',
drawbox=x='"'"'194+24*min(max(t-1.1,0),1)'"'"':y=86:w='"'"'56*min(max(t-1.1,0),1)'"'"':h=7:color=0xfacc15@1:t=fill,
drawbox=x=246:y='"'"'94-22*min(max(t-1.8,0),1)'"'"':w='"'"'56+22*min(max(t-1.8,0),1)'"'"':h='"'"'46+18*min(max(t-1.8,0),1)'"'"':color=0xf97316@0.44:t=fill,
drawbox=x=244:y=54:w=78:h=70:color=0xf97316@0.92:t=5:enable='"'"'between(t,2.0,4)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_vertex_shader.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=48:y=52:w=220:h=92:color=0x64748b@0.10:t=fill,
drawbox=x=60:y=40:w=220:h=92:color=0xe2e8f0@0.95:t=fill,
drawbox=x=60:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=100:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=140:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=180:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=220:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=260:y=40:w=4:h=92:color=0xbfc8d5@1:t=fill,
drawbox=x=60:y=40:w=204:h=4:color=0xbfc8d5@1:t=fill,
drawbox=x=60:y=80:w=204:h=4:color=0xbfc8d5@1:t=fill,
drawbox=x=60:y=120:w=204:h=4:color=0xbfc8d5@1:t=fill,
drawbox=x=92:y=52:w=120:h=78:color=0x2563eb@0.22:t=fill:enable='"'"'between(t,0,1.2)'"'"',
drawbox=x=92:y=52:w='"'"'120-26*min(max(t-1.0,0),1)'"'"':h='"'"'78-18*min(max(t-1.0,0),1)'"'"':color=0x2563eb@0.38:t=fill:enable='"'"'between(t,1.0,3.1)'"'"',
drawbox=x='"'"'132+22*min(max(t-1.3,0),1)'"'"':y='"'"'90+10*sin(6*t)'"'"':w=18:h=18:color=0xf97316@1:t=fill,
drawbox=x=98:y=58:w=100:h=66:color=0xf59e0b@0.34:t=fill:enable='"'"'between(t,2.1,4)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_rasterization.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=26:y=48:w=112:h=92:color=0x581c87@0.16:t=fill,
drawbox=x=40:y=34:w=112:h=92:color=0x7c3aed@0.16:t=fill,
drawbox=x=154:y=48:w=88:h=92:color=0x581c87@0.24:t=fill,
drawbox=x=142:y=36:w=88:h=92:color=0x7c3aed@0.92:t=fill,
drawbox=x=236:y=48:w=92:h=92:color=0x831843@0.18:t=fill,
drawbox=x=224:y=36:w=92:h=92:color=0xec4899@0.16:t=fill,
drawbox=x='"'"'46+42*min(t,1)'"'"':y=60:w=20:h=20:color=0x7c3aed@1:t=fill,
drawbox=x='"'"'60+54*min(max(t-0.4,0),1)'"'"':y=94:w=20:h=20:color=0x38bdf8@1:t=fill,
drawbox=x='"'"'74+62*min(max(t-0.8,0),1)'"'"':y=76:w=20:h=20:color=0xf59e0b@1:t=fill,
drawbox=x='"'"'244+9*sin(8*t)'"'"':y=60:w=24:h=24:color=0xf59e0b@1:t=fill:enable='"'"'between(t,1.5,4)'"'"',
drawbox=x='"'"'272+9*sin(8*t+0.8)'"'"':y=88:w=24:h=24:color=0xec4899@1:t=fill:enable='"'"'between(t,1.7,4)'"'"',
drawbox=x='"'"'300+9*sin(8*t+1.4)'"'"':y=70:w=24:h=24:color=0x22c55e@1:t=fill:enable='"'"'between(t,1.9,4)'"'"',
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_fragment_shader.gif

ffmpeg -y -f lavfi -i color=c=0xf8fafc:s=360x180:d=4:r=16 -filter_complex '
[0:v]
drawbox=x=24:y=50:w=116:h=92:color=0x1e3a8a@0.18:t=fill,
drawbox=x=38:y=36:w=116:h=92:color=0x2563eb@0.16:t=fill,
drawbox=x=204:y=50:w=118:h=92:color=0x7f1d1d@0.20:t=fill,
drawbox=x=190:y=36:w=118:h=92:color=0xdc2626@0.16:t=fill,
drawbox=x='"'"'48+34*min(t,1)'"'"':y=58:w=26:h=22:color=0x2563eb@1:t=fill,
drawbox=x='"'"'58+46*min(max(t-0.5,0),1)'"'"':y=90:w=26:h=22:color=0x38bdf8@1:t=fill,
drawbox=x='"'"'68+56*min(max(t-1.0,0),1)'"'"':y=120:w=26:h=22:color=0xf59e0b@1:t=fill,
drawbox=x=210:y=56:w='"'"'90*min(max(t-1.4,0),1)'"'"':h=20:color=0xf59e0b@1:t=fill,
drawbox=x=210:y=86:w='"'"'98*min(max(t-1.9,0),1)'"'"':h=20:color=0xec4899@0.95:t=fill,
drawbox=x=210:y=116:w='"'"'106*min(max(t-2.4,0),1)'"'"':h=20:color=0x22c55e@0.95:t=fill,
split[a][b];
[a]palettegen[p];
[b][p]paletteuse
' assets/pipeline_gifs/stage_color_output.gif
