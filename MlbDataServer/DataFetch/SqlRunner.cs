using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MlbDataServer.DataFetch
{
	public class SqlRunner
	{
		public static DataTable RunSproc(string sprocName, IEnumerable<SprocParam> sprocParams)
		{
			var settings = ConfigurationManager.ConnectionStrings["Bbt"];
			var connectionString = settings.ConnectionString;
			var dataTable = new DataTable();

			try
			{
				var con = new SqlConnection(connectionString);
				con.Open();

				var cmd = new SqlCommand(sprocName, con)
				{
					CommandType = CommandType.StoredProcedure
				};


				foreach (var sprocParam in sprocParams)
				{
					cmd.Parameters.Add($"@{sprocParam.ParamName}", sprocParam.Type).Value = sprocParam.Value;
				}

				var adapter = new SqlDataAdapter
				{
					SelectCommand = cmd
				};

				adapter.SelectCommand.CommandType = CommandType.StoredProcedure;

				adapter.Fill(dataTable);

				adapter.Dispose();
				cmd.Dispose();
				con.Close();
			}
			catch (Exception e)
			{
				Console.WriteLine(e.Message);
			}

			return dataTable;
		}
	}

	public class SprocParam
	{
		public string ParamName { get; }
		public SqlDbType Type { get; }
		public object Value { get; }

		public SprocParam(string paramName, SqlDbType type, object value)
		{
			this.ParamName = paramName;
			this.Type = type;
			this.Value = value;
		}
	}
}