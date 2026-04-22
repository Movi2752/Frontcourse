// components/FloorPlan.jsx — SVG floor plan renderer

function FloorPlanSVG({ tables, getStatus, selectedTable, onSelect, restaurantId }) {
  const layout = FLOOR_LAYOUTS[restaurantId];
  if (!layout) return null;
  const { W, H, walls, features } = layout;

  // Color palette for statuses
  const STATUS_COLORS = {
    free:     { fill: '#d4eddf', stroke: '#3A7D5A', text: '#2a6048' },
    booked:   { fill: '#fadadd', stroke: '#C0392B', text: '#a03020' },
    small:    { fill: '#ececec', stroke: '#b0b0b0', text: '#909090' },
    selected: { fill: '#fde8dc', stroke: '#B85C2A', text: '#8a3a10' },
  };

  function tableColor(t) {
    if (selectedTable?.id === t.id) return STATUS_COLORS.selected;
    return STATUS_COLORS[getStatus(t)] || STATUS_COLORS.free;
  }

  // Draw chairs as small circles around the table circle
  function renderChairs(cx, cy, r, count, color) {
    const chairs = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i / count) - Math.PI / 2;
      const cr = r + 9;
      const px = cx + cr * Math.cos(angle);
      const py = cy + cr * Math.sin(angle);
      chairs.push(<circle key={i} cx={px} cy={py} r={5} fill={color.fill} stroke={color.stroke} strokeWidth="1.2"/>);
    }
    return chairs;
  }

  function renderTable(t) {
    const cx = t.x / 100 * W;
    const cy = t.y / 100 * H;
    const isLarge = t.capacity >= 7;
    const color = tableColor(t);
    const status = selectedTable?.id === t.id ? 'selected' : getStatus(t);
    const canClick = status !== 'booked' && status !== 'small';
    const r = t.capacity <= 2 ? 22 : t.capacity <= 4 ? 28 : t.capacity <= 6 ? 33 : 38;

    if (isLarge) {
      // Rectangular banquet table
      const tw = 80, th = 40;
      return (
        <g key={t.id} onClick={() => canClick && onSelect(t)}
           style={{cursor: canClick ? 'pointer' : 'not-allowed'}}
           transform={`translate(${cx},${cy})`}>
          {/* chairs top/bottom */}
          {[0,1,2].map(i => <rect key={`t${i}`} x={-40 + i*30} y={-th/2-13} width={22} height={9} rx={3} fill={color.fill} stroke={color.stroke} strokeWidth="1.2"/>)}
          {[0,1,2].map(i => <rect key={`b${i}`} x={-40 + i*30} y={th/2+4} width={22} height={9} rx={3} fill={color.fill} stroke={color.stroke} strokeWidth="1.2"/>)}
          <rect x={-tw/2} y={-th/2} width={tw} height={th} rx={5}
            fill={color.fill} stroke={color.stroke} strokeWidth="2"
            opacity={status==='small'?0.45:1}/>
          <text x={0} y={-5} textAnchor="middle" fontSize={11} fontWeight="700" fill={color.text}>{t.number}</text>
          <text x={0} y={8} textAnchor="middle" fontSize={9} fill={color.text} opacity={0.7}>{t.capacity} мест</text>
        </g>
      );
    }

    return (
      <g key={t.id} onClick={() => canClick && onSelect(t)}
         style={{cursor: canClick ? 'pointer' : 'not-allowed'}}
         className={selectedTable?.id === t.id ? 'fp-table-selected' : ''}>
        {renderChairs(cx, cy, r, Math.min(t.capacity, 8), color)}
        <circle cx={cx} cy={cy} r={r}
          fill={color.fill} stroke={color.stroke} strokeWidth="2"
          opacity={status==='small'?0.4:1}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={12} fontWeight="700" fill={color.text}>{t.number}</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize={9} fill={color.text} opacity={0.7}>{t.capacity}</text>
      </g>
    );
  }

  function renderFeature(f, i) {
    if (f.type === 'rect') return (
      <g key={i}>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.fill||'#88776611'} stroke={f.stroke||'#a09080'} strokeWidth={f.sw||1.5} rx={4}/>
        {f.label && <text x={f.x + f.w/2} y={f.y + f.h/2 + 4} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5} fontWeight="700">{f.label}</text>}
      </g>
    );
    if (f.type === 'window') {
      if (f.vertical) {
        const onRight = f.x > W/2;
        return <rect key={i} x={onRight ? f.x-10 : f.x} y={f.y} width={10} height={f.h} fill="#6090c033" stroke="#6090c0" strokeWidth={1.5}/>;
      }
      const onBottom = f.y > H/2;
      return <rect key={i} x={f.x} y={onBottom ? f.y-10 : f.y} width={f.w} height={10} fill="#6090c033" stroke="#6090c0" strokeWidth={1.5}/>;
    }
    if (f.type === 'door') return (
      <g key={i}>
        <rect x={f.x} y={f.y-3} width={f.w} height={6} rx={2} fill="#d4c4a8" stroke="#a08060" strokeWidth={1}/>
        <text x={f.x + f.w/2} y={f.y+16} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>{f.label}</text>
      </g>
    );
    if (f.type === 'label') return (
      <text key={i} x={f.x} y={f.y} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.35} fontWeight="700" letterSpacing="1">{f.text}</text>
    );
    return null;
  }

  return (
    <div className="floor-plan-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block',maxHeight:460}}>
        <rect x={0} y={0} width={W} height={H} fill="var(--bg2)"/>
        {features.map((f,i) => renderFeature(f,i))}
        {walls.filter(w=>w.type==='line').map((w,i)=>(
          <line key={'p'+i} x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
            stroke="currentColor" opacity={0.18} strokeWidth={1.5}
            strokeDasharray={w.dash||'8,5'}/>
        ))}
        {walls.filter(w=>w.type==='rect').map((w,i)=>(
          <rect key={'w'+i} x={w.x+1} y={w.y+1} width={w.w-2} height={w.h-2}
            fill="none" stroke="currentColor" opacity={0.35} strokeWidth={3}/>
        ))}
        {tables.map(t => renderTable(t))}
      </svg>
    </div>
  );
}
