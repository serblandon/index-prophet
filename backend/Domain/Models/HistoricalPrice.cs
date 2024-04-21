﻿using System;
using System.Collections.Generic;

namespace Domain.Models;

public partial class HistoricalPrice
{
    public int Id { get; set; }

    public string Ticker { get; set; } = null!;

    public DateOnly Date { get; set; }

    public decimal AdjClosePrice { get; set; }
}
