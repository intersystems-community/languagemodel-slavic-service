/*-
 * $Id$
 */
package com.intersystems.iknow.languagemodel.slavic.service;

import static java.util.Arrays.asList;
import static java.util.Collections.list;
import static javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.RemoteException;
import java.util.List;

import javax.servlet.GenericServlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import com.intersystems.iknow.languagemodel.slavic.SerializingMorphologicalAnalyzer;
import com.intersystems.iknow.languagemodel.slavic.impl.LanguageToolAnalyzer;

/**
 * @author Andrey Shcheglov (mailto:andrey.shcheglov@intersystems.com)
 */
public final class CoreServlet extends HttpServlet {
	private static final long serialVersionUID = 351007833874267975L;

	private SerializingMorphologicalAnalyzer analyzer;

	/**
	 * @see GenericServlet#init()
	 */
	@Override
	public void init() throws ServletException {
		try {
			this.analyzer = new SerializingMorphologicalAnalyzer(new LanguageToolAnalyzer());
		} catch (final IOException | ParserConfigurationException | SAXException e) {
			throw new ServletException(e);
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest, HttpServletResponse)
	 */
	@Override
	protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
	throws ServletException, IOException {
		/*
		 * Set character encoding before we obtain a writer.
		 */
		response.setCharacterEncoding("UTF-8");

		final String texts[] = request.getParameterValues("text");
		if (texts != null && texts.length > 1) {
			final String message = "text is specified more than once: " + asList(texts);
			response.sendError(SC_BAD_REQUEST, message);
			return;
		}

		final List<String> extraParameters = list(request.getParameterNames());
		extraParameters.removeAll(asList("text"));
		if (!extraParameters.isEmpty()) {
			final String message = "Unsupported request parameters: " + extraParameters;
			response.sendError(SC_BAD_REQUEST, message);
			return;
		}

		try (final PrintWriter out = response.getWriter()) {
			try {
				response.setContentType("application/json");
				this.analyzer.analyze(texts == null ? null : texts[0]);
				out.println(this.analyzer.analyze(texts == null ? null : texts[0]));
				out.flush();
			} catch (final RemoteException re) {
				response.sendError(SC_INTERNAL_SERVER_ERROR, re.getMessage());
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest, HttpServletResponse)
	 */
	@Override
	protected void doPost(final HttpServletRequest request, final HttpServletResponse response)
	throws ServletException, IOException {
		this.doGet(request, response);
	}
}
