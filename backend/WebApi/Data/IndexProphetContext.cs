﻿using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Data;

public partial class IndexProphetContext : DbContext
{
    public IndexProphetContext(DbContextOptions<IndexProphetContext> options)
        : base(options)
    {
    }

    public virtual DbSet<HistoricalPrice> HistoricalPrices { get; set; }
    public virtual DbSet<PredictedPrice> PredictedPrices { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HistoricalPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("historical_prices_pkey");

            entity.ToTable("historical_prices");

            entity.HasIndex(e => new { e.Ticker, e.Date }, "historical_prices_ticker_date_key").IsUnique();

            entity.HasIndex(e => e.Ticker, "idx_ticker");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AdjClosePrice)
                .HasPrecision(20, 6)
                .HasColumnName("adj_close_price");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Ticker)
                .HasMaxLength(12)
                .HasColumnName("ticker");
        });

        modelBuilder.Entity<PredictedPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("predicted_prices_pkey");

            entity.ToTable("predicted_prices");

            entity.HasIndex(e => new { e.Ticker, e.PredictionMethod }, "idx_ticker_prediction_method");

            entity.HasIndex(e => new { e.Ticker, e.Date, e.PredictionMethod }, "predicted_prices_ticker_date_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AdjClosePrice)
                .HasPrecision(20, 6)
                .HasColumnName("adj_close_price");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.PredictionMethod)
                .HasMaxLength(30)
                .HasColumnName("prediction_method");
            entity.Property(e => e.Ticker)
                .HasMaxLength(12)
                .HasColumnName("ticker");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
