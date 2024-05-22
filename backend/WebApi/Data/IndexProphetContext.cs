using Microsoft.EntityFrameworkCore;
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
    public virtual DbSet<TechnicalIndicator> TechnicalIndicators { get; set; }


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

        modelBuilder.Entity<TechnicalIndicator>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("technical_indicators_pkey");

            entity.ToTable("technical_indicators");

            entity.HasIndex(e => new { e.Ticker, e.Date, e.BollingerLower }, "unique_ticker_date_bollinger_lower").IsUnique();

            entity.HasIndex(e => new { e.Ticker, e.Date, e.BollingerUpper }, "unique_ticker_date_bollinger_upper").IsUnique();

            entity.HasIndex(e => new { e.Ticker, e.Date, e.Macd }, "unique_ticker_date_macd").IsUnique();

            entity.HasIndex(e => new { e.Ticker, e.Date, e.Rsi }, "unique_ticker_date_rsi").IsUnique();

            entity.HasIndex(e => new { e.Ticker, e.Date, e.SignalLine }, "unique_ticker_date_signal_line").IsUnique();

            entity.HasIndex(e => new { e.Ticker, e.Date, e.Sma }, "unique_ticker_date_sma").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BollingerLower)
                .HasPrecision(20, 6)
                .HasColumnName("bollinger_lower");
            entity.Property(e => e.BollingerUpper)
                .HasPrecision(20, 6)
                .HasColumnName("bollinger_upper");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Macd)
                .HasPrecision(20, 6)
                .HasColumnName("macd");
            entity.Property(e => e.Rsi)
                .HasPrecision(20, 6)
                .HasColumnName("rsi");
            entity.Property(e => e.SignalLine)
                .HasPrecision(20, 6)
                .HasColumnName("signal_line");
            entity.Property(e => e.Sma)
                .HasPrecision(20, 6)
                .HasColumnName("sma");
            entity.Property(e => e.Ticker)
                .HasMaxLength(12)
                .HasColumnName("ticker");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
