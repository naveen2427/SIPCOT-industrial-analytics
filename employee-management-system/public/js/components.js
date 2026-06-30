// Reusable Dynamic UI Components
window.components = {
  
  // Render Dynamic SVG Bar Chart
  renderDepartmentSVGChart(containerId, departmentData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!departmentData || departmentData.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);">No chart data available</div>';
      return;
    }

    const width = 500;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find max value for scaling
    const maxVal = Math.max(...departmentData.map(d => d.value), 4); // fallback minimum scale

    // Build chart elements
    let svgContent = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.3" />
          </linearGradient>
          <linearGradient id="activeBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--success)" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.5" />
          </linearGradient>
        </defs>
        
        <!-- Y Gridlines and Labels -->
        ${[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return `
            <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"/>
            <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end">${val}</text>
          `;
        }).join('')}
    `;

    // Render Bars
    const barCount = departmentData.length;
    const gapRatio = 0.4; // 40% gap
    const barWidth = chartWidth / (barCount + (barCount - 1) * gapRatio);
    const gapWidth = barWidth * gapRatio;

    departmentData.forEach((dept, idx) => {
      const x = paddingLeft + idx * (barWidth + gapWidth);
      const valRatio = dept.value / maxVal;
      const barHeight = chartHeight * valRatio;
      const y = paddingTop + chartHeight - barHeight;

      // Draw single bar
      svgContent += `
        <g class="chart-group" style="cursor: pointer;" onclick="filterByDepartment(${dept.id || idx + 1})">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#barGrad)" rx="6" ry="6" class="chart-bar">
            <title>${dept.name}: ${dept.value} Employees</title>
          </rect>
          <!-- Text labels under the bars -->
          <text x="${x + barWidth / 2}" y="${height - paddingBottom + 18}" fill="var(--text-secondary)" font-size="10" font-weight="500" text-anchor="middle">
            ${dept.name.substring(0, 10)}${dept.name.length > 10 ? '..' : ''}
          </text>
          <!-- Value on top of bar on hover / static -->
          <text x="${x + barWidth / 2}" y="${y - 6}" fill="var(--text-primary)" font-size="11" font-weight="700" text-anchor="middle" opacity="0.8">
            ${dept.value}
          </text>
        </g>
      `;
    });

    svgContent += `
      <!-- Base Axis Line -->
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" stroke-width="1.5"/>
      </svg>
    `;

    container.innerHTML = svgContent;
  },

  // Render Department Metric Cards in Sidebar
  renderDepartmentMetricsList(containerId, departmentData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!departmentData || departmentData.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);">No departments data.</div>';
      return;
    }

    // Curated colors for dots
    const dotColors = [
      'var(--primary)',
      'var(--success)',
      'var(--warning)',
      'var(--danger)',
      '#06b6d4',
      '#ec4899'
    ];

    let html = '';
    departmentData.forEach((dept, idx) => {
      const color = dotColors[idx % dotColors.length];
      const payrollStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(dept.payroll || 0);
      
      html += `
        <div class="dept-item" style="cursor: pointer;" onclick="filterByDepartment(${dept.id || idx + 1})">
          <div class="dept-name-group">
            <span class="dept-color-dot" style="background-color: ${color};"></span>
            <span style="font-size:0.9rem; font-weight:500;">${dept.name}</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <span class="dept-item-value">${dept.value} head</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${payrollStr} payroll</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // Render Employee Row for Directory Grid
  renderEmployeeRow(employee, onRowClick, onEditClick, onDeleteClick) {
    const formattedSalary = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(employee.salary);
    const statusClass = employee.status.toLowerCase().replace(' ', '-');
    
    // Status badges mapping
    const statusPill = `
      <span class="status-pill ${statusClass}">
        <span class="status-dot"></span>
        ${employee.status}
      </span>
    `;

    // Row wrapper
    const tr = document.createElement('tr');
    tr.className = 'table-row';
    // Clicking anywhere on row opens drawer except clicking edit/delete buttons
    tr.addEventListener('click', (e) => {
      if (!e.target.closest('.action-btn-click')) {
        onRowClick(employee.id);
      }
    });

    tr.innerHTML = `
      <td>
        <div class="employee-cell">
          <img src="${employee.profile_image}" alt="${employee.first_name}" class="employee-avatar">
          <div>
            <div class="employee-name">${employee.fullName}</div>
            <div class="employee-email">${employee.email}</div>
          </div>
        </div>
      </td>
      <td><span style="font-weight: 500;">${employee.role}</span></td>
      <td>${employee.department_name || 'N/A'}</td>
      <td><span style="font-family: monospace; font-weight:600;">${formattedSalary}</span></td>
      <td>${employee.hire_date}</td>
      <td>${statusPill}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.editEmployee(${employee.id})" title="Edit Employee">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.deleteEmployee(${employee.id})" title="Archive/Delete Employee" style="color:var(--danger); border-color: hsla(346, 80%, 55%, 0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </td>
    `;

    return tr;
  },

  // Render Employee Details inside Sidebar Drawer
  renderEmployeeDrawerContent(employee, logs) {
    const formattedSalary = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(employee.salary);
    const tenureYears = Math.floor(employee.tenureInMonths / 12);
    const tenureRemainingMonths = employee.tenureInMonths % 12;
    let tenureStr = '';
    
    if (tenureYears > 0) {
      tenureStr = `${tenureYears} year${tenureYears > 1 ? 's' : ''} ${tenureRemainingMonths} month${tenureRemainingMonths !== 1 ? 's' : ''}`;
    } else {
      tenureStr = `${employee.tenureInMonths} month${employee.tenureInMonths !== 1 ? 's' : ''}`;
    }

    const logItemsHtml = logs && logs.length > 0
      ? logs.map(log => {
          let detailsHtml = '';
          const actionClass = log.action.toLowerCase();
          
          if (log.action === 'UPDATED' && log.details.changes) {
            detailsHtml = `
              <ul class="log-diff-list">
                ${Object.entries(log.details.changes).map(([field, delta]) => {
                  const label = field.replace('_', ' ');
                  return `<li class="log-diff-item"><strong style="text-transform:capitalize;">${label}</strong>: <span>${delta.from}</span> &rarr; <span>${delta.to}</span></li>`;
                }).join('')}
              </ul>
            `;
          } else if (log.details.message) {
            detailsHtml = `<div class="log-details">${log.details.message}</div>`;
          }

          const localTime = new Date(log.timestamp).toLocaleString();

          return `
            <div class="log-item ${actionClass}">
              <div class="log-header">
                <span>${log.action}</span>
                <span class="log-time">${localTime}</span>
              </div>
              ${detailsHtml}
            </div>
          `;
        }).join('')
      : '<div style="color:var(--text-muted); font-size:0.8rem;">No activity log history available.</div>';

    return `
      <!-- Profile Header Summary -->
      <div class="profile-card">
        <img src="${employee.profile_image}" alt="${employee.first_name}" class="profile-card-avatar">
        <div class="profile-card-details">
          <h2>${employee.fullName}</h2>
          <div class="title">${employee.role}</div>
          <span class="status-pill ${employee.status.toLowerCase().replace(' ', '-')}">
            <span class="status-dot"></span>
            ${employee.status}
          </span>
        </div>
      </div>

      <!-- Relational Data & OOP Computations -->
      <div class="profile-info-grid">
        <div class="info-item">
          <span class="info-label">Email Address</span>
          <span class="info-value">${employee.email}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone Number</span>
          <span class="info-value">${employee.phone}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Department</span>
          <span class="info-value">${employee.department_name || 'Loading...'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Hire Date</span>
          <span class="info-value">${employee.hire_date}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Salary (Annual)</span>
          <span class="info-value" style="font-family: monospace; font-weight:600;">${formattedSalary}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Calculated Tenure</span>
          <span class="info-value" style="color:var(--success); font-weight:600;">${tenureStr}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Est. Tax Bracket</span>
          <span class="info-value" style="font-family: monospace;">${employee.taxBracket}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Benefits Plan Tier</span>
          <span class="info-value" style="font-size:0.8rem; color:var(--text-secondary); line-height:1.2;">${employee.benefitsEligibility}</span>
        </div>
      </div>

      <!-- Professional Bio -->
      <div class="info-item" style="display:flex; flex-direction:column; gap:8px;">
        <span class="info-label">Professional Profile Biography</span>
        <div class="bio-box">${employee.bio || 'No biography has been added for this employee record.'}</div>
      </div>

      <!-- Relational Activity History (Audit Trail) -->
      <div class="logs-section">
        <span class="info-label">System Transaction Audit Logs</span>
        <div class="logs-timeline">
          ${logItemsHtml}
        </div>
      </div>
    `;
  }
};
