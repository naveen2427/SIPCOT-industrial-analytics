window.components = {
  // Render Dynamic SVG Genre Bar Chart
  renderGenreSVGChart(containerId, genreData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!genreData || genreData.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted); text-align:center;">No catalog data available</div>';
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

    const maxVal = Math.max(...genreData.map(d => d.value), 4);

    let svgContent = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.3" />
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

    const barCount = genreData.length;
    const gapRatio = 0.4;
    const barWidth = chartWidth / (barCount + (barCount - 1) * gapRatio);
    const gapWidth = barWidth * gapRatio;

    genreData.forEach((genre, idx) => {
      const x = paddingLeft + idx * (barWidth + gapWidth);
      const valRatio = genre.value / maxVal;
      const barHeight = chartHeight * valRatio;
      const y = paddingTop + chartHeight - barHeight;

      svgContent += `
        <g style="cursor: pointer;" onclick="filterByGenre('${genre.name}')">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#barGrad)" rx="6" ry="6" class="chart-bar">
            <title>${genre.name}: ${genre.value} Books</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${height - paddingBottom + 18}" fill="var(--text-secondary)" font-size="10" font-weight="500" text-anchor="middle">
            ${genre.name.substring(0, 10)}${genre.name.length > 10 ? '..' : ''}
          </text>
          <text x="${x + barWidth / 2}" y="${y - 6}" fill="var(--text-primary)" font-size="11" font-weight="700" text-anchor="middle" opacity="0.8">
            ${genre.value}
          </text>
        </g>
      `;
    });

    svgContent += `
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" stroke-width="1.5"/>
      </svg>
    `;

    container.innerHTML = svgContent;
  },

  // Render Genre Summary list
  renderGenreBreakdownList(containerId, genreData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!genreData || genreData.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);">No genres metadata.</div>';
      return;
    }

    const dotColors = ['var(--primary)', 'var(--success)', 'var(--warning)', '#0284c7', '#a855f7'];

    let html = '';
    genreData.forEach((genre, idx) => {
      const color = dotColors[idx % dotColors.length];
      html += `
        <div class="genre-item" onclick="filterByGenre('${genre.name}')">
          <div class="genre-name-group">
            <span class="genre-color-dot" style="background-color: ${color};"></span>
            <span style="font-size:0.9rem; font-weight:500;">${genre.name}</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <span class="genre-item-value">${genre.value} titles</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${genre.available_copies}/${genre.total_copies} available</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // Render Book row for Directory Catalog
  renderBookRow(book, onEditClick, onDeleteClick) {
    const statusClass = book.available_copies > 0 ? 'available' : 'unavailable';
    const statusText = book.available_copies > 0 ? 'Available' : 'Checked Out';
    
    const statusPill = `
      <span class="status-pill ${statusClass}">
        <span class="status-dot"></span>
        ${statusText} (${book.available_copies}/${book.total_copies})
      </span>
    `;

    const tr = document.createElement('tr');
    tr.className = 'table-row';
    
    tr.innerHTML = `
      <td>
        <div class="book-row-detail">
          <img src="/images/book_cover_placeholder.png" alt="Book cover" class="book-cover-thumbnail" />
          <div>
            <div class="book-title-cell">${book.title}</div>
            <div class="book-author-cell">${book.author}</div>
          </div>
        </div>
      </td>
      <td><span style="font-family: monospace; font-weight:500;">${book.isbn}</span></td>
      <td>${book.genre}</td>
      <td><span style="font-weight: 500;">${book.shelf_location}</span></td>
      <td>${book.published_year}</td>
      <td>${statusPill}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.editBook(${book.id})" title="Edit Book">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.deleteBook(${book.id})" title="Delete Book" style="color:var(--danger); border-color: hsla(346, 80%, 55%, 0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </td>
    `;
    return tr;
  },

  // Render Member row for Registry directory
  renderMemberRow(member, onRowClick, onEditClick, onDeleteClick) {
    const statusClass = member.status.toLowerCase();
    const statusPill = `
      <span class="status-pill ${statusClass}">
        <span class="status-dot"></span>
        ${member.status}
      </span>
    `;

    const tr = document.createElement('tr');
    tr.className = 'table-row';
    tr.addEventListener('click', (e) => {
      if (!e.target.closest('.action-btn-click')) {
        onRowClick(member.id);
      }
    });

    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="profile-card-icon" style="width:34px; height:34px; font-size:0.9rem;">
            ${member.first_name[0]}${member.last_name[0]}
          </div>
          <span class="book-title-cell">${member.fullName}</span>
        </div>
      </td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.joined_date}</td>
      <td>${statusPill}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.editMember(${member.id})" title="Edit Member">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button class="btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.deleteMember(${member.id})" title="Delete Member" style="color:var(--danger); border-color: hsla(346, 80%, 55%, 0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </td>
    `;
    return tr;
  },

  // Render Loan transaction row
  renderLoanRow(loan, onReturnClick) {
    const isOverdue = loan.isOverdue;
    const statusClass = loan.return_date ? 'returned' : (isOverdue ? 'overdue' : 'borrowed');
    const statusText = loan.return_date ? 'Returned' : (isOverdue ? 'Overdue' : 'Active');

    const statusPill = `
      <span class="status-pill ${statusClass}">
        <span class="status-dot"></span>
        ${statusText}
      </span>
    `;

    const actionHtml = loan.return_date
      ? `<span style="color:var(--text-muted); font-size:0.85rem;">Checked In</span>`
      : `<button class="btn btn-secondary btn-icon-only action-btn-click" onclick="event.stopPropagation(); window.appControllers.returnBook(${loan.id})" title="Return Book">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span style="font-size:0.8rem; font-weight:600;">Return</span>
         </button>`;

    const tr = document.createElement('tr');
    tr.className = 'table-row';
    tr.innerHTML = `
      <td>
        <span class="book-title-cell">${loan.book_title || 'Loading book...'}</span>
      </td>
      <td>${loan.member_name || 'Loading member...'}</td>
      <td>${loan.borrow_date}</td>
      <td>${loan.due_date}</td>
      <td>${loan.return_date || '-'}</td>
      <td>
        <span style="font-family: monospace; font-weight:600; color: ${loan.computedFine > 0 ? 'var(--danger)' : 'var(--text-secondary)'}">
          ₹${loan.computedFine}
        </span>
      </td>
      <td>${actionHtml}</td>
    `;
    return tr;
  },

  // Render Member Drawer inspector details
  renderMemberDrawerContent(member, logs) {
    const tenureYears = Math.floor(member.membershipTenureInMonths / 12);
    const tenureMonths = member.membershipTenureInMonths % 12;
    const tenureStr = tenureYears > 0 
      ? `${tenureYears} yr${tenureYears > 1 ? 's' : ''} ${tenureMonths} mo${tenureMonths !== 1 ? 's' : ''}`
      : `${member.membershipTenureInMonths} mo${member.membershipTenureInMonths !== 1 ? 's' : ''}`;

    const activeLoans = logs.filter(log => log.action === 'CHECKED_OUT' && !logs.some(l => l.action === 'RETURNED' && l.book_id === log.book_id && new Date(l.timestamp) > new Date(log.timestamp)));

    const activeLoansHtml = activeLoans && activeLoans.length > 0
      ? activeLoans.map(loan => `
          <div class="book-row-detail" style="background-color: var(--bg-surface-elevated); padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); margin-top: 6px; display: flex; align-items: center; gap: 12px;">
            <img src="/images/book_cover_placeholder.png" alt="Book cover" class="book-cover-thumbnail" style="width: 30px; height: 42px;" />
            <div>
              <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${loan.book_title}</div>
              <div style="font-size: 0.75rem; color: var(--danger);">Due: ${loan.details.dueDate}</div>
            </div>
          </div>
        `).join('')
      : '<div style="color:var(--text-muted); font-size:0.8rem; margin-top: 6px;">No outstanding book loans.</div>';

    const logItemsHtml = logs && logs.length > 0
      ? logs.map(log => {
          const actionClass = log.action.toLowerCase();
          const localTime = new Date(log.timestamp).toLocaleString();
          let detailsHtml = `<div class="log-details">${log.details.message}</div>`;
          
          if (log.action === 'CHECKED_OUT') {
            detailsHtml += `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Due date: ${log.details.dueDate}</div>`;
          } else if (log.action === 'RETURNED' && log.details.finePaid > 0) {
            detailsHtml += `<div style="font-size:0.75rem; color:var(--danger); margin-top:2px;">Fines Paid: ₹${log.details.finePaid}</div>`;
          }

          return `
            <div class="log-item ${actionClass}">
              <div class="log-header">
                <span>${log.action.replace('_', ' ')}</span>
                <span class="log-time">${localTime}</span>
              </div>
              ${detailsHtml}
            </div>
          `;
        }).join('')
      : '<div style="color:var(--text-muted); font-size:0.8rem;">No borrowing history logs.</div>';

    return `
      <div class="profile-card">
        <div class="profile-card-icon">
          ${member.first_name[0]}${member.last_name[0]}
        </div>
        <div class="profile-card-details">
          <h2>${member.fullName}</h2>
          <div class="subtitle">Joined: ${member.joined_date}</div>
          <span class="status-pill ${member.status.toLowerCase()}">
            <span class="status-dot"></span>
            ${member.status}
          </span>
        </div>
      </div>

      <div class="profile-info-grid">
        <div class="info-item">
          <span class="info-label">Email Address</span>
          <span class="info-value">${member.email}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone Number</span>
          <span class="info-value">${member.phone}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Membership Tenure</span>
          <span class="info-value" style="color:var(--primary); font-weight:600;">${tenureStr}</span>
        </div>
        <div class="info-item" style="grid-column: span 2; margin-top: 8px;">
          <span class="info-label">Outstanding Loans (${activeLoans.length} active / Max: 3)</span>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${activeLoansHtml}
          </div>
        </div>
      </div>

      <div class="logs-section">
        <span class="info-label">Activity Timeline logs</span>
        <div class="logs-timeline">
          ${logItemsHtml}
        </div>
      </div>
    `;
  }
};
